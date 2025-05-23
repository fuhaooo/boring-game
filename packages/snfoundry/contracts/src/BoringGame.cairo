#[starknet::interface]
pub trait IBoringGame<TContractState> {
    fn start_game(ref self: TContractState) -> bool;
    fn record_score(ref self: TContractState, score: u256);
    fn mint_achievement_nft(ref self: TContractState, achievement_id: u8) -> bool;
    fn get_player_info(self: @TContractState, player: starknet::ContractAddress) -> (u256, u256, u256);
    fn get_achievement(self: @TContractState, id: u8) -> (u8, felt252, felt252, u256);
    fn is_achievement_unlocked(self: @TContractState, player: starknet::ContractAddress, achievement_id: u8) -> bool;
}

#[starknet::contract]
pub mod BoringGame {
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address, get_block_timestamp};
    use super::IBoringGame;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // STRK代币合约地址 - Sepolia测试网
    pub const STRK_CONTRACT_ADDRESS: felt252 = 
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;
        
    // 目标钱包地址
    pub const TARGET_WALLET_ADDRESS: felt252 =
        0x011bf31D662FF2638447c5BF401f97b6CaFF5DAbcBEE772dbcEDFC6319b66Bba;

    // 玩家信息结构
    #[derive(Drop, Copy, Serde, starknet::Store)]
    pub struct PlayerInfo {
        highest_score: u256,
        games_played: u256,
        achievements_unlocked: u256,
    }

    // 成就结构
    #[derive(Drop, Copy, Serde, starknet::Store)]
    pub struct Achievement {
        id: u8,
        name: felt252,
        description: felt252,
        requirement: u256,  // 需要的积分
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        GameStarted: GameStarted,
        AchievementUnlocked: AchievementUnlocked,
        NFTMinted: NFTMinted,
    }

    // 游戏开始事件
    #[derive(Drop, starknet::Event)]
    struct GameStarted {
        #[key]
        player: ContractAddress,
        timestamp: u64,
    }

    // 成就解锁事件
    #[derive(Drop, starknet::Event)]
    struct AchievementUnlocked {
        #[key]
        player: ContractAddress,
        #[key]
        achievement_id: u8,
    }

    // NFT铸造事件
    #[derive(Drop, starknet::Event)]
    struct NFTMinted {
        #[key]
        player: ContractAddress,
        #[key]
        achievement_id: u8,
        nft_url: felt252,
    }

    #[storage]
    struct Storage {
        game_fee: u256,  // 游戏费用（1 STRK）
        players: Map<ContractAddress, PlayerInfo>,
        achievements: Map<u8, Achievement>,
        minted_nfts: Map<(ContractAddress, u8), bool>,
        nft_urls: Map<u8, felt252>,  // 成就对应的NFT图片URL
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.game_fee.write(1_000_000_000_000_000_000);  // 1 STRK
        self.ownable.initializer(owner);
        
        // 初始化成就
        self.achievements.write(
            1,
            Achievement { id: 1, name: 'Beginner', description: 'Reach 100 points', requirement: 100 }
        );
        self.achievements.write(
            2,
            Achievement { id: 2, name: 'Intermediate', description: 'Reach 500 points', requirement: 500 }
        );
        self.achievements.write(
            3,
            Achievement { id: 3, name: 'Advanced', description: 'Reach 1000 points', requirement: 1000 }
        );
        
        // 添加龙珠成就
        self.achievements.write(
            4,
            Achievement { id: 4, name: 'I Have Seen Dragon', description: 'Collect all seven Dragon Balls', requirement: 0 }
        );
        
        // 设置NFT图片URL - 缩短URL，使用hash替代
        self.nft_urls.write(4, 'ipfs://bafybeiciojjygr67dngem');
    }

    #[abi(embed_v0)]
    impl BoringGameImpl of IBoringGame<ContractState> {
        // 开始游戏（付费）
        fn start_game(ref self: ContractState) -> bool {
            let caller = get_caller_address();
            let fee = self.game_fee.read();
            
            // 处理STRK代币转账到指定钱包
            let strk_contract_address: ContractAddress = STRK_CONTRACT_ADDRESS.try_into().expect('Invalid address');
            let target_wallet: ContractAddress = TARGET_WALLET_ADDRESS.try_into().expect('Invalid address');
            
            // 使用标准的ERC20接口
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_contract_address };
            
            // 从用户转账1 STRK到指定钱包
            let success = strk_dispatcher.transfer_from(caller, target_wallet, fee);
            assert(success, 'STRK transfer failed');
            
            // 更新玩家信息
            let mut player = self.players.read(caller);
            player.games_played += 1;
            self.players.write(caller, player);
            
            // 发送事件
            self.emit(
                GameStarted {
                    player: caller,
                    timestamp: get_block_timestamp(),
                }
            );

            return true;
        }
        
        // 记录最高分
        fn record_score(ref self: ContractState, score: u256) {
            let caller = get_caller_address();
            let mut player = self.players.read(caller);
            
            if score > player.highest_score {
                player.highest_score = score;
                self.players.write(caller, player);
                
                // 检查是否解锁成就
                self._check_achievements(caller, score);
            }
        }
        
        // 铸造NFT
        fn mint_achievement_nft(ref self: ContractState, achievement_id: u8) -> bool {
            let caller = get_caller_address();
            
            // 检查是否已解锁该成就
            let achievement = self.achievements.read(achievement_id);
            
            // 对于龙珠成就(ID=4)，不检查分数要求，只要用户标记已解锁即可
            let mut is_unlocked = false;
            if achievement_id == 4 {
                // 龙珠成就特殊处理，依赖前端逻辑确认用户已集齐七颗龙珠
                is_unlocked = true;
            } else {
                // 常规积分成就
                let player = self.players.read(caller);
                is_unlocked = player.highest_score >= achievement.requirement;
            }
            
            assert(is_unlocked, 'Achievement not unlocked');
            assert(!self.minted_nfts.read((caller, achievement_id)), 'NFT already minted');
            
            // 标记NFT已铸造
            self.minted_nfts.write((caller, achievement_id), true);
            
            // 获取NFT图片URL
            let nft_url = self.nft_urls.read(achievement_id);
            
            // 发送铸造事件
            self.emit(
                NFTMinted {
                    player: caller,
                    achievement_id: achievement_id,
                    nft_url: nft_url,
                }
            );

            return true;
        }
        
        // 查询玩家信息
        fn get_player_info(self: @ContractState, player: ContractAddress) -> (u256, u256, u256) {
            let player_info = self.players.read(player);
            (player_info.highest_score, player_info.games_played, player_info.achievements_unlocked)
        }
        
        // 查询成就信息
        fn get_achievement(self: @ContractState, id: u8) -> (u8, felt252, felt252, u256) {
            let achievement = self.achievements.read(id);
            (achievement.id, achievement.name, achievement.description, achievement.requirement)
        }
        
        // 查询成就是否解锁
        fn is_achievement_unlocked(self: @ContractState, player: ContractAddress, achievement_id: u8) -> bool {
            // 对于龙珠成就，通过查询是否已铸造NFT来判断是否解锁
            if achievement_id == 4 {
                return self.minted_nfts.read((player, achievement_id));
            }
            
            // 常规积分成就
            let player_info = self.players.read(player);
            let achievement = self.achievements.read(achievement_id);
            player_info.highest_score >= achievement.requirement
        }
    }

    // 内部函数实现
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        // 检查成就
        fn _check_achievements(ref self: ContractState, player_address: ContractAddress, score: u256) {
            // 遍历检查积分成就（ID 1-3）
            let mut i: u8 = 1;
            loop {
                if i > 3 {
                    break;
                }
                let achievement = self.achievements.read(i);
                if score >= achievement.requirement {
                    // 发送成就解锁事件
                    self.emit(
                        AchievementUnlocked {
                            player: player_address,
                            achievement_id: i,
                        }
                    );
                }
                i += 1;
            }
        }
    }
} 