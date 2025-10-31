// This file contains the matches and criterias data, with each match having a nested main criteria.

export interface IMatch {
  id: number;
  home_team: string;
  away_team: string;
  home_team_score: number;
  away_team_score: number;
  start_time: string;
  end_time: string | null;
  created_by: string;
  home_team_image_url: string;
  away_team_image_url: string;
  main_criteria: IMainCriteria;
}

export interface IMainCriteria {
  id: number;
  match_id: number;
  name: string;
  created_by: string;
  odds: IOdd[];
}

export interface IOdd {
  id: number;
  name: string;
  value: number | string;
  minimum_amount: number;
  maximum_amount: number;
  created_by: string;
}

export interface IChannel {
  id: number;
  name: string;
  image_url: string;
  created_by: string;
  created_at: string;
  members: IChannelMember[];
}

export interface IChannelMember {
  id: number;
  name: string;
  role: 'admin' | 'member';
}

export const mockData: { matches: IMatch[]; criterias: IMainCriteria[]; channels: IChannel[] } = {
  matches: [
    {
      id: 1,
      home_team: 'Manchester United',
      away_team: 'Newcastle United',
      home_team_score: 2,
      away_team_score: 1,
      start_time: '2025-09-09T20:47:16.569338Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061361/betolyn/team-badges/manchester_united.png',
      away_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061364/betolyn/team-badges/newcastle_united.png',
      main_criteria: {
        id: 201,
        match_id: 1,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 301,
            name: 'Manchester United Win',
            value: 2.1,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 302,
            name: 'Draw',
            value: 3.4,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 303,
            name: 'Newcastle United Win',
            value: 3.1,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
    {
      id: 2,
      home_team: 'Manchester City',
      away_team: 'Wolverhampton WOL',
      home_team_score: 0,
      away_team_score: 0,
      start_time: '2025-09-09T20:47:16.578085Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061363/betolyn/team-badges/manchester_city.png',
      away_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061365/betolyn/team-badges/wolverhampton_wanderers.png',
      main_criteria: {
        id: 202,
        match_id: 2,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 304,
            name: 'Manchester City Win',
            value: 1.5,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 305,
            name: 'Draw',
            value: 4.0,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 306,
            name: 'Wolverhampton WOL Win',
            value: 5.5,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
    {
      id: 3,
      home_team: 'GD Interclube',
      away_team: 'Primeiro de Agosto',
      home_team_score: 1,
      away_team_score: 1,
      start_time: '2025-09-09T20:47:16.580188Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061363/betolyn/team-badges/grupo_desportivo_interclube.png',
      away_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061366/betolyn/team-badges/cd_primeiro_de_agosto.png',
      main_criteria: {
        id: 203,
        match_id: 3,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 307,
            name: 'GD Interclube Win',
            value: 2.5,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 308,
            name: 'Draw',
            value: 3.2,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 309,
            name: 'Primeiro de Agosto Win',
            value: 2.8,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
    {
      id: 4,
      home_team: 'Toulouse FC',
      away_team: 'Paris Saint-Germain',
      home_team_score: 0,
      away_team_score: 0,
      start_time: '2025-09-09T20:47:16.582378Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url: 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
      away_team_image_url: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
      main_criteria: {
        id: 204,
        match_id: 4,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 310,
            name: 'Toulouse FC Win',
            value: 5.0,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 311,
            name: 'Draw',
            value: 3.8,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 312,
            name: 'Paris Saint-Germain Win',
            value: 1.65,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
    {
      id: 5,
      home_team: 'Lille OSC',
      away_team: 'Olympique Lyonnais',
      home_team_score: 0,
      away_team_score: 0,
      start_time: '2025-09-09T20:47:16.584180Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url: 'https://a.espncdn.com/i/teamlogos/soccer/500/166.png',
      away_team_image_url: 'https://a.espncdn.com/i/teamlogos/soccer/500/167.png',
      main_criteria: {
        id: 205,
        match_id: 5,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 313,
            name: 'Lille OSC Win',
            value: 2.2,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 314,
            name: 'Draw',
            value: 3.1,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 315,
            name: 'Olympique Lyonnais Win',
            value: 3.0,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
    {
      id: 6,
      home_team: 'Anderson Silva',
      away_team: 'Wanderlei Silva',
      home_team_score: 0,
      away_team_score: 0,
      start_time: '2025-09-09T20:47:16.585871Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/anderson_silva.png',
      away_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/wanderlei_silva.png',
      main_criteria: {
        id: 206,
        match_id: 6,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 316,
            name: 'Anderson Silva Win',
            value: 1.25,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 317,
            name: 'Draw',
            value: 8.0,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 318,
            name: 'Wanderlei Silva Win',
            value: 4.5,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
    {
      id: 7,
      home_team: 'Conor McGregor',
      away_team: 'Khabib Nurmagomedov',
      home_team_score: 0,
      away_team_score: 0,
      start_time: '2025-09-09T20:47:16.587965Z',
      end_time: null,
      created_by: 'system',
      home_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/conor_mcgregor.png',
      away_team_image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1757061357/betolyn/athletes/khabib_nurmagomedov.png',
      main_criteria: {
        id: 207,
        match_id: 7,
        name: 'Match Winner',
        created_by: 'system',
        odds: [
          {
            id: 319,
            name: 'Conor McGregor Win',
            value: 2.75,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 320,
            name: 'Draw',
            value: 5.0,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
          {
            id: 321,
            name: 'Khabib Nurmagomedov Win',
            value: 1.4,
            minimum_amount: 5.0,
            maximum_amount: 100.0,
            created_by: 'system',
          },
        ],
      },
    },
  ],
  criterias: [
    {
      id: 208,
      match_id: 1,
      name: 'Final Score',
      created_by: 'system',
      odds: [
        {
          id: 322,
          name: 'Man Utd 2-1 Newcastle',
          value: 8.5,
          minimum_amount: 5.0,
          maximum_amount: 100.0,
          created_by: 'system',
        },
        {
          id: 323,
          name: 'Man Utd 1-0 Newcastle',
          value: 12.0,
          minimum_amount: 5.0,
          maximum_amount: 100.0,
          created_by: 'system',
        },
      ],
    },
    {
      id: 209,
      match_id: 1,
      name: 'Total Goals',
      created_by: 'system',
      odds: [
        {
          id: 324,
          name: 'Over 2.5 Goals',
          value: 1.75,
          minimum_amount: 5.0,
          maximum_amount: 100.0,
          created_by: 'system',
        },
        {
          id: 325,
          name: 'Under 2.5 Goals',
          value: 2.05,
          minimum_amount: 5.0,
          maximum_amount: 100.0,
          created_by: 'system',
        },
      ],
    },
    {
      id: 210,
      match_id: 1,
      name: 'Yellow Cards',
      created_by: 'system',
      odds: [
        {
          id: 326,
          name: 'Over 3.5 Cards',
          value: 1.95,
          minimum_amount: 5.0,
          maximum_amount: 100.0,
          created_by: 'system',
        },
        {
          id: 327,
          name: 'Under 3.5 Cards',
          value: 1.85,
          minimum_amount: 5.0,
          maximum_amount: 100.0,
          created_by: 'system',
        },
      ],
    },
  ],
  channels: [
    {
      id: 1,
      name: 'Amantes Convictos de Luta Livre',
      image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1758451911/betolyn/channels/ufc.png',
      created_by: 'Divaldo Ghost',
      created_at: '2025-09-09T20:47:16.589062Z',
      members: [
        {
          id: 1,
          name: 'Divaldo Ghost',
          role: 'admin',
        },
        {
          id: 2,
          name: 'Edvan Magalhães',
          role: 'member',
        },
        {
          id: 3,
          name: 'Carlos Silva',
          role: 'member',
        },
        {
          id: 4,
          name: 'Ana Santos',
          role: 'member',
        },
      ],
    },
    {
      id: 2,
      name: 'Campeonato Futebol de Praia (Samba) 19/20',
      image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1758451959/betolyn/channels/soccer.png',
      created_by: 'Maria Oliveira',
      created_at: '2025-09-09T20:47:16.591156Z',
      members: [
        {
          id: 5,
          name: 'Maria Oliveira',
          role: 'admin',
        },
        {
          id: 6,
          name: 'João Pereira',
          role: 'member',
        },
        {
          id: 7,
          name: 'Sofia Costa',
          role: 'member',
        },
        {
          id: 8,
          name: 'Pedro Fernandes',
          role: 'member',
        },
        {
          id: 9,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
      ],
    },
    {
      id: 3,
      name: 'Amantes de Ciclismo Angola',
      image_url:
        'https://res.cloudinary.com/db9ha9ox6/image/upload/v1758451964/betolyn/channels/tourfrance.png',
      created_by: 'Rui Almeida',
      created_at: '2025-09-09T20:47:16.591156Z',
      members: [
        {
          id: 10,
          name: 'Rui Almeida',
          role: 'admin',
        },
        {
          id: 11,
          name: 'Carla Mendes',
          role: 'member',
        },
        {
          id: 12,
          name: 'Miguel Sousa',
          role: 'member',
        },
        {
          id: 13,
          name: 'Teresa Lopes',
          role: 'member',
        },
        {
          id: 14,
          name: 'João Silva',
          role: 'member',
        },
        {
          id: 15,
          name: 'Maria Oliveira',
          role: 'member',
        },
        {
          id: 16,
          name: 'Pedro Fernandes',
          role: 'member',
        },
        {
          id: 17,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
        {
          id: 18,
          name: 'João Silva',
          role: 'member',
        },
        {
          id: 19,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
        {
          id: 20,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
        {
          id: 21,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
        {
          id: 22,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
        {
          id: 23,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
        {
          id: 24,
          name: 'Isabel Rodrigues',
          role: 'member',
        },
      ],
    },
  ],
};
