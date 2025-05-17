#[starknet::interface]
pub trait IBoringGame<TContractState> {
    fn start_game(ref self: TContractState) -> bool;
    fn record_score(ref self: TContractState, score: u256);
    fn mint_achievement_nft(ref self: TContractState, achievement_id: u8) -> bool;
    fn get_player_info(self: @TContractState, player: starknet::ContractAddress) -> PlayerInfo;
    fn get_achievement(self: @TContractState, id: u8) -> Achievement;
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

    // STRK代币合约地址
    pub const FELT_STRK_CONTRACT: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

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
    }

    #[storage]
    struct Storage {
        game_fee: u256,  // 游戏费用（1 STRK）
        players: Map<ContractAddress, PlayerInfo>,
        achievements: Map<u8, Achievement>,
        minted_nfts: Map<(ContractAddress, u8), bool>,
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
    }

    #[abi(embed_v0)]
    impl BoringGameImpl of IBoringGame<ContractState> {
        // 开始游戏（付费）
        fn start_game(ref self: ContractState) -> bool {
            let caller = get_caller_address();
            let fee = self.game_fee.read();
            
            // 这里应该有转账逻辑，处理支付，为简化示例暂时省略实际支付
            // let strk_contract_address = FELT_STRK_CONTRACT.try_into().unwrap();
            // let strk_dispatcher = IERC20Dispatcher { contract_address: strk_contract_address };
            // strk_dispatcher.transfer_from(caller, get_contract_address(), fee);
            
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
            let player = self.players.read(caller);
            let achievement = self.achievements.read(achievement_id);
            
            assert(player.highest_score >= achievement.requirement, 'Achievement not unlocked');
            assert(!self.minted_nfts.read((caller, achievement_id)), 'NFT already minted');
            
            // 标记NFT已铸造
            self.minted_nfts.write((caller, achievement_id), true);
            
            // 发送铸造事件
            self.emit(
                NFTMinted {
                    player: caller,
                    achievement_id: achievement_id,
                }
            );

            return true;
        }
        
        // 查询玩家信息
        fn get_player_info(self: @ContractState, player: ContractAddress) -> PlayerInfo {
            self.players.read(player)
        }
        
        // 查询成就信息
        fn get_achievement(self: @ContractState, id: u8) -> Achievement {
            self.achievements.read(id)
        }
        
        // 查询成就是否解锁
        fn is_achievement_unlocked(self: @ContractState, player: ContractAddress, achievement_id: u8) -> bool {
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
            // 遍历检查所有成就
            // 简化实现，实际应该使用更优的方法
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