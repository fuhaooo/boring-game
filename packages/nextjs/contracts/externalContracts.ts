// 可能需要创建此文件来添加外部合约配置
const externalContracts = {
  devnet: {
    BoringGame: {
      address: "", // 部署后填入地址
      abi: [
        {
          type: "interface",
          name: "contracts::IBoringGame",
          items: [
            {
              type: "function",
              name: "start_game",
              inputs: [],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "record_score",
              inputs: [
                {
                  name: "score",
                  type: "core::integer::u256",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "mint_achievement_nft",
              inputs: [
                {
                  name: "achievement_id",
                  type: "core::integer::u8",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "get_player_info",
              inputs: [
                {
                  name: "player",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [
                {
                  type: "PlayerInfo",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "get_achievement",
              inputs: [
                {
                  name: "id",
                  type: "core::integer::u8",
                },
              ],
              outputs: [
                {
                  type: "Achievement",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "is_achievement_unlocked",
              inputs: [
                {
                  name: "player",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "achievement_id",
                  type: "core::integer::u8",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "view",
            },
          ],
        },
        {
          type: "struct",
          name: "PlayerInfo",
          members: [
            {
              name: "highest_score",
              type: "core::integer::u256",
            },
            {
              name: "games_played",
              type: "core::integer::u256",
            },
            {
              name: "achievements_unlocked",
              type: "core::integer::u256",
            },
          ],
        },
        {
          type: "struct",
          name: "Achievement",
          members: [
            {
              name: "id",
              type: "core::integer::u8",
            },
            {
              name: "name",
              type: "core::felt252",
            },
            {
              name: "description",
              type: "core::felt252",
            },
            {
              name: "requirement",
              type: "core::integer::u256",
            },
          ],
        },
      ],
      classHash: "", // 部署后填入class hash
    },
  },
  sepolia: {
    BoringGame: {
      address: "0x3e4aa5993cc45e05bd5ffa6789d883e1632e4a5df73caec16d8e4010c517719",
      abi: [
        {
          type: "interface",
          name: "contracts::IBoringGame",
          items: [
            {
              type: "function",
              name: "start_game",
              inputs: [],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "record_score",
              inputs: [
                {
                  name: "score",
                  type: "core::integer::u256",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "mint_achievement_nft",
              inputs: [
                {
                  name: "achievement_id",
                  type: "core::integer::u8",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "get_player_info",
              inputs: [
                {
                  name: "player",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [
                {
                  type: "PlayerInfo",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "get_achievement",
              inputs: [
                {
                  name: "id",
                  type: "core::integer::u8",
                },
              ],
              outputs: [
                {
                  type: "Achievement",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "is_achievement_unlocked",
              inputs: [
                {
                  name: "player",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "achievement_id",
                  type: "core::integer::u8",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "view",
            },
          ],
        },
        {
          type: "struct",
          name: "PlayerInfo",
          members: [
            {
              name: "highest_score",
              type: "core::integer::u256",
            },
            {
              name: "games_played",
              type: "core::integer::u256",
            },
            {
              name: "achievements_unlocked",
              type: "core::integer::u256",
            },
          ],
        },
        {
          type: "struct",
          name: "Achievement",
          members: [
            {
              name: "id",
              type: "core::integer::u8",
            },
            {
              name: "name",
              type: "core::felt252",
            },
            {
              name: "description",
              type: "core::felt252",
            },
            {
              name: "requirement",
              type: "core::integer::u256",
            },
          ],
        },
      ],
      classHash: "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
    },
  },
};

export default externalContracts; 