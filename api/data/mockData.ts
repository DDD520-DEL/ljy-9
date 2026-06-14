import type { Cartridge, PriceHistory, Achievement, ExchangeRequest, Review, Exchange, UserRating, CollectorLeaderboardEntry, Accessory } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const cartridges: Cartridge[] = [
  {
    id: '1',
    title: '超级马里奥兄弟',
    platform: 'FC',
    series: '超级马里奥',
    publisher: '任天堂',
    releaseYear: 1985,
    region: 'JPN',
    condition: 'NEAR_MINT',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 1200,
    purchaseDate: '2023-06-15',
    notes: '品相极佳，收藏级品质',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20nintendo%20game%20cartridge%20super%20mario%20bros%20pixel%20art&image_size=square',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
  },
  {
    id: '2',
    title: '塞尔达传说',
    platform: 'FC',
    series: '塞尔达传说',
    publisher: '任天堂',
    releaseYear: 1986,
    region: 'JPN',
    condition: 'VERY_GOOD',
    hasBox: true,
    hasManual: false,
    hasCartridge: true,
    purchasePrice: 2500,
    purchaseDate: '2023-08-20',
    notes: '黄金卡带，稀有度高',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20zelda%20gold%20cartridge%20nes%20pixel%20art&image_size=square',
    createdAt: '2023-08-20T00:00:00Z',
    updatedAt: '2023-08-20T00:00:00Z',
  },
  {
    id: '3',
    title: '最终幻想VI',
    platform: 'SFC',
    series: '最终幻想',
    publisher: '史克威尔',
    releaseYear: 1994,
    region: 'JPN',
    condition: 'MINT',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 800,
    purchaseDate: '2024-01-10',
    notes: '近乎全新，箱说全',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=final%20fantasy%20vi%20snes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    title: '勇者斗恶龙V',
    platform: 'SFC',
    series: '勇者斗恶龙',
    publisher: '艾尼克斯',
    releaseYear: 1992,
    region: 'JPN',
    condition: 'NEAR_MINT',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 1500,
    purchaseDate: '2023-11-05',
    notes: '天空三部曲第二部',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dragon%20quest%20v%20snes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2023-11-05T00:00:00Z',
    updatedAt: '2023-11-05T00:00:00Z',
  },
  {
    id: '5',
    title: '口袋妖怪 红',
    platform: 'GB',
    series: '口袋妖怪',
    publisher: '任天堂',
    releaseYear: 1996,
    region: 'JPN',
    condition: 'GOOD',
    hasBox: false,
    hasManual: false,
    hasCartridge: true,
    purchasePrice: 300,
    purchaseDate: '2024-03-12',
    notes: '卡带正常，电池已更换',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pokemon%20red%20gameboy%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
  {
    id: '6',
    title: '魂斗罗',
    platform: 'FC',
    series: '魂斗罗',
    publisher: '科乐美',
    releaseYear: 1987,
    region: 'JPN',
    condition: 'VERY_GOOD',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 450,
    purchaseDate: '2023-09-28',
    notes: '经典射击游戏',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=contra%20nes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2023-09-28T00:00:00Z',
    updatedAt: '2023-09-28T00:00:00Z',
  },
  {
    id: '7',
    title: '星之卡比',
    platform: 'GB',
    series: '星之卡比',
    publisher: '任天堂',
    releaseYear: 1992,
    region: 'JPN',
    condition: 'NEAR_MINT',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 280,
    purchaseDate: '2024-02-14',
    notes: '卡比首作',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kirby%20dream%20land%20gameboy%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2024-02-14T00:00:00Z',
    updatedAt: '2024-02-14T00:00:00Z',
  },
  {
    id: '8',
    title: '街头霸王II',
    platform: 'SFC',
    series: '街头霸王',
    publisher: '卡普空',
    releaseYear: 1992,
    region: 'JPN',
    condition: 'GOOD',
    hasBox: true,
    hasManual: false,
    hasCartridge: true,
    purchasePrice: 350,
    purchaseDate: '2023-07-22',
    notes: '格斗游戏经典',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20fighter%20ii%20snes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2023-07-22T00:00:00Z',
    updatedAt: '2023-07-22T00:00:00Z',
  },
  {
    id: '9',
    title: '超级银河战士',
    platform: 'SFC',
    series: '银河战士',
    publisher: '任天堂',
    releaseYear: 1994,
    region: 'USA',
    condition: 'NEAR_MINT',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 1800,
    purchaseDate: '2024-04-05',
    notes: '美版盒装，收藏佳品',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=super%20metroid%20snes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
  {
    id: '10',
    title: '洛克人X',
    platform: 'SFC',
    series: '洛克人',
    publisher: '卡普空',
    releaseYear: 1993,
    region: 'JPN',
    condition: 'VERY_GOOD',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 650,
    purchaseDate: '2023-12-01',
    notes: '洛克人X系列首作',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=megaman%20x%20snes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: '11',
    title: '口袋妖怪 绿',
    platform: 'GB',
    series: '口袋妖怪',
    publisher: '任天堂',
    releaseYear: 1996,
    region: 'JPN',
    condition: 'FAIR',
    hasBox: false,
    hasManual: false,
    hasCartridge: true,
    purchasePrice: 200,
    purchaseDate: '2024-01-25',
    notes: '标签有磨损，功能正常',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pokemon%20green%20gameboy%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '12',
    title: '火焰纹章 纹章之谜',
    platform: 'SFC',
    series: '火焰纹章',
    publisher: '任天堂',
    releaseYear: 1994,
    region: 'JPN',
    condition: 'NEAR_MINT',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 1200,
    purchaseDate: '2024-03-30',
    notes: 'SRPG经典之作',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fire%20emblem%20snes%20cartridge%20pixel%20art&image_size=square',
    createdAt: '2024-03-30T00:00:00Z',
    updatedAt: '2024-03-30T00:00:00Z',
  },
];

const generatePriceHistory = (cartridge: typeof cartridges[0]) => {
  const basePrice = cartridge.purchasePrice;
  const sources = ['雅虎拍卖', 'Mercari', 'eBay', '闲鱼'];
  const volatileCartridgeIds = ['2', '9', '5'];

  return Array.from({ length: 12 }, (_, i) => {
    const monthAgo = 11 - i;
    const date = new Date();
    date.setMonth(date.getMonth() - monthAgo);

    let priceMultiplier = 0.8 + Math.random() * 0.6 + (11 - monthAgo) * 0.02;

    if (volatileCartridgeIds.includes(cartridge.id)) {
      if (monthAgo === 0) {
        if (cartridge.id === '2') {
          priceMultiplier = 1.8;
        } else if (cartridge.id === '9') {
          priceMultiplier = 0.65;
        } else if (cartridge.id === '5') {
          priceMultiplier = 1.45;
        }
      } else if (monthAgo === 1) {
        if (cartridge.id === '2') {
          priceMultiplier = 1.1;
        } else if (cartridge.id === '9') {
          priceMultiplier = 1.05;
        } else if (cartridge.id === '5') {
          priceMultiplier = 1.0;
        }
      }
    }

    return sources.map((source, idx) => ({
      id: `${cartridge.id}-${i}-${idx}`,
      cartridgeId: cartridge.id,
      platform: source,
      price: Math.round(basePrice * priceMultiplier + (Math.random() - 0.5) * basePrice * 0.05),
      date: date.toISOString().split('T')[0],
      source,
    }));
  }).flat();
};

export const priceHistories: PriceHistory[] = [
  ...cartridges.flatMap((cartridge) => generatePriceHistory(cartridge)),
];

export const achievements: Achievement[] = [
  {
    id: 'first-cartridge',
    name: '初入收藏',
    description: '录入你的第一张游戏卡带',
    icon: 'Gamepad2',
    category: 'collection',
    condition: { type: 'total_cartridges', value: 1 },
    unlocked: true,
    unlockedAt: '2023-06-15T00:00:00Z',
    progress: 12,
    progressMax: 1,
  },
  {
    id: 'ten-cartridges',
    name: '小有收藏',
    description: '拥有10张游戏卡带',
    icon: 'Library',
    category: 'collection',
    condition: { type: 'total_cartridges', value: 10 },
    unlocked: true,
    unlockedAt: '2024-03-12T00:00:00Z',
    progress: 12,
    progressMax: 10,
  },
  {
    id: 'twenty-cartridges',
    name: '收藏达人',
    description: '拥有20张游戏卡带',
    icon: 'Trophy',
    category: 'collection',
    condition: { type: 'total_cartridges', value: 20 },
    unlocked: false,
    progress: 12,
    progressMax: 20,
  },
  {
    id: 'complete-pokemon-gen1',
    name: '口袋妖怪初代大师',
    description: '集齐口袋妖怪红绿蓝黄',
    icon: 'Sparkles',
    category: 'series',
    condition: { type: 'complete_series', value: '口袋妖怪' },
    unlocked: false,
    progress: 2,
    progressMax: 4,
  },
  {
    id: 'all-platforms',
    name: '全平台玩家',
    description: '收藏3个以上平台的游戏',
    icon: 'Monitor',
    category: 'milestone',
    condition: { type: 'total_platforms', value: 3 },
    unlocked: true,
    unlockedAt: '2023-09-28T00:00:00Z',
    progress: 3,
    progressMax: 3,
  },
  {
    id: 'mint-collector',
    name: '品相控',
    description: '拥有5张MINT级别的卡带',
    icon: 'Crown',
    category: 'rare',
    condition: { type: 'condition_count', value: 'MINT' },
    unlocked: false,
    progress: 1,
    progressMax: 5,
  },
  {
    id: 'box-manual',
    name: '箱说全收藏',
    description: '拥有10张箱说全的卡带',
    icon: 'Package',
    category: 'collection',
    condition: { type: 'complete_in_box', value: 10 },
    unlocked: false,
    progress: 7,
    progressMax: 10,
  },
  {
    id: 'rare-edition',
    name: '稀世珍藏',
    description: '拥有一张展会限定版卡带',
    icon: 'Gem',
    category: 'rare',
    condition: { type: 'rare_edition', value: 1 },
    unlocked: false,
    progress: 0,
    progressMax: 1,
  },
  {
    id: 'year-80s',
    name: '80年代复古',
    description: '收藏5张80年代发售的游戏',
    icon: 'Clock',
    category: 'milestone',
    condition: { type: 'decade_count', value: '1980s' },
    unlocked: false,
    progress: 3,
    progressMax: 5,
  },
  {
    id: 'value-thousand',
    name: '千金难买心头好',
    description: '收藏总价值超过10000元',
    icon: 'Banknote',
    category: 'milestone',
    condition: { type: 'total_value', value: 10000 },
    unlocked: true,
    unlockedAt: '2024-04-05T00:00:00Z',
    progress: 11230,
    progressMax: 10000,
  },
  {
    id: 'nintendo-fan',
    name: '任豚',
    description: '收藏8款任天堂发行的游戏',
    icon: 'Star',
    category: 'series',
    condition: { type: 'publisher_count', value: '任天堂' },
    unlocked: true,
    unlockedAt: '2024-02-14T00:00:00Z',
    progress: 6,
    progressMax: 8,
  },
  {
    id: 'exchange-master',
    name: '交换达人',
    description: '成功完成3次卡带交换',
    icon: 'Repeat',
    category: 'milestone',
    condition: { type: 'exchange_count', value: 3 },
    unlocked: false,
    progress: 0,
    progressMax: 3,
  },
];

export const exchangeRequests: ExchangeRequest[] = [
  {
    id: 'mywant1',
    userId: 'user1',
    userName: '像素收藏家',
    type: 'WANT',
    cartridgeTitle: '超级马里奥兄弟',
    platform: 'FC',
    description: '求购一张品相好的初代马里奥，箱说全优先',
    condition: 'NEAR_MINT',
    createdAt: '2024-05-28T00:00:00Z',
  },
  {
    id: 'mywant2',
    userId: 'user1',
    userName: '像素收藏家',
    type: 'WANT',
    cartridgeTitle: '口袋妖怪',
    platform: 'GB',
    description: '收口袋妖怪系列任意版本，功能正常即可',
    condition: 'GOOD',
    createdAt: '2024-05-30T00:00:00Z',
  },
  {
    id: 'mywant3',
    userId: 'user1',
    userName: '像素收藏家',
    type: 'WANT',
    cartridgeTitle: '最终幻想',
    platform: 'SFC',
    description: '求购SFC平台最终幻想系列，FF4/5/6都可以',
    condition: 'VERY_GOOD',
    createdAt: '2024-06-02T00:00:00Z',
  },
  {
    id: 'ex1',
    userId: 'user2',
    userName: '复古玩家小王',
    type: 'HAVE',
    cartridgeTitle: '超级马里奥兄弟3',
    platform: 'FC',
    description: '品相9成新，箱说全，想换同级别塞尔达游戏',
    condition: 'NEAR_MINT',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'ex2',
    userId: 'user3',
    userName: 'SFC收藏家',
    type: 'WANT',
    cartridgeTitle: '最终幻想VI',
    platform: 'SFC',
    description: '收一张成色好的FF6，箱说全优先',
    condition: 'VERY_GOOD',
    createdAt: '2024-06-05T00:00:00Z',
  },
  {
    id: 'ex3',
    userId: 'user4',
    userName: 'GB爱好者',
    type: 'HAVE',
    cartridgeTitle: '口袋妖怪 黄',
    platform: 'GB',
    description: '皮卡丘版，功能完好，电池刚换',
    condition: 'GOOD',
    createdAt: '2024-06-08T00:00:00Z',
  },
  {
    id: 'ex4',
    userId: 'user5',
    userName: '卡带猎人',
    type: 'WANT',
    cartridgeTitle: '塞尔达传说 众神的三角力量',
    platform: 'SFC',
    description: '高价收品相好的日版',
    condition: 'NEAR_MINT',
    createdAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'ex5',
    userId: 'user6',
    userName: '怀旧游戏屋',
    type: 'HAVE',
    cartridgeTitle: '魂斗罗 力量',
    platform: 'FC',
    description: '成色一般，卡带功能正常',
    condition: 'FAIR',
    createdAt: '2024-06-11T00:00:00Z',
  },
  {
    id: 'ex6',
    userId: 'user7',
    userName: 'SFC老玩家',
    type: 'HAVE',
    cartridgeTitle: '最终幻想VI',
    platform: 'SFC',
    description: 'FF6日版，箱说全，品相近新',
    condition: 'NEAR_MINT',
    createdAt: '2024-06-12T00:00:00Z',
  },
];

export const currentUserId = 'user1';
export const currentUserName = '像素收藏家';

export const exchanges: Exchange[] = [
  {
    id: 'exch1',
    requestId: 'mywant1',
    matchRequestId: 'ex1',
    initiatorUserId: 'user1',
    initiatorUserName: '像素收藏家',
    targetUserId: 'user2',
    targetUserName: '复古玩家小王',
    cartridgeTitle: '超级马里奥兄弟3',
    platform: 'FC',
    status: 'COMPLETED',
    initiatorReviewed: true,
    targetReviewed: true,
    createdAt: '2024-06-01T00:00:00Z',
    completedAt: '2024-06-05T00:00:00Z',
  },
  {
    id: 'exch2',
    requestId: 'mywant2',
    matchRequestId: 'ex3',
    initiatorUserId: 'user1',
    initiatorUserName: '像素收藏家',
    targetUserId: 'user4',
    targetUserName: 'GB爱好者',
    cartridgeTitle: '口袋妖怪 黄',
    platform: 'GB',
    status: 'COMPLETED',
    initiatorReviewed: false,
    targetReviewed: true,
    createdAt: '2024-06-08T00:00:00Z',
    completedAt: '2024-06-12T00:00:00Z',
  },
  {
    id: 'exch3',
    requestId: 'mywant3',
    matchRequestId: 'ex6',
    initiatorUserId: 'user1',
    initiatorUserName: '像素收藏家',
    targetUserId: 'user7',
    targetUserName: 'SFC老玩家',
    cartridgeTitle: '最终幻想VI',
    platform: 'SFC',
    status: 'PENDING',
    initiatorReviewed: false,
    targetReviewed: false,
    createdAt: '2024-06-12T00:00:00Z',
  },
];

export const reviews: Review[] = [
  {
    id: 'rev1',
    exchangeId: 'exch1',
    fromUserId: 'user1',
    fromUserName: '像素收藏家',
    toUserId: 'user2',
    toUserName: '复古玩家小王',
    rating: 5,
    comment: '非常爽快的交易！卡带品相完美，包装也很用心，下次还会合作。',
    cartridgeTitle: '超级马里奥兄弟3',
    createdAt: '2024-06-06T00:00:00Z',
  },
  {
    id: 'rev2',
    exchangeId: 'exch1',
    fromUserId: 'user2',
    fromUserName: '复古玩家小王',
    toUserId: 'user1',
    toUserName: '像素收藏家',
    rating: 4,
    comment: '沟通顺畅，付款及时，是个靠谱的收藏家。',
    cartridgeTitle: '超级马里奥兄弟3',
    createdAt: '2024-06-06T00:00:00Z',
  },
  {
    id: 'rev3',
    exchangeId: 'exch2',
    fromUserId: 'user4',
    fromUserName: 'GB爱好者',
    toUserId: 'user1',
    toUserName: '像素收藏家',
    rating: 5,
    comment: '交易非常愉快，买家很专业，对游戏很了解。',
    cartridgeTitle: '口袋妖怪 黄',
    createdAt: '2024-06-13T00:00:00Z',
  },
  {
    id: 'rev4',
    exchangeId: 'fake1',
    fromUserId: 'user3',
    fromUserName: 'SFC收藏家',
    toUserId: 'user2',
    toUserName: '复古玩家小王',
    rating: 5,
    comment: '老玩家就是靠谱，卡带质量没得说！',
    cartridgeTitle: '塞尔达传说',
    createdAt: '2024-05-20T00:00:00Z',
  },
  {
    id: 'rev5',
    exchangeId: 'fake2',
    fromUserId: 'user5',
    fromUserName: '卡带猎人',
    toUserId: 'user2',
    toUserName: '复古玩家小王',
    rating: 4,
    comment: '整体不错，发货稍微慢了一点。',
    cartridgeTitle: '火焰纹章',
    createdAt: '2024-05-15T00:00:00Z',
  },
  {
    id: 'rev6',
    exchangeId: 'fake3',
    fromUserId: 'user6',
    fromUserName: '怀旧游戏屋',
    toUserId: 'user4',
    toUserName: 'GB爱好者',
    rating: 5,
    comment: '非常专业的卖家，卡带测试完好才发货。',
    cartridgeTitle: '星之卡比',
    createdAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 'rev7',
    exchangeId: 'fake4',
    fromUserId: 'user2',
    fromUserName: '复古玩家小王',
    toUserId: 'user7',
    toUserName: 'SFC老玩家',
    rating: 5,
    comment: 'SFC游戏收藏大师，品相无可挑剔！',
    cartridgeTitle: '最终幻想VI',
    createdAt: '2024-05-25T00:00:00Z',
  },
];

export const userRatings: UserRating[] = [
  {
    userId: 'user1',
    userName: '像素收藏家',
    averageRating: 4.5,
    totalReviews: 2,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
  },
  {
    userId: 'user2',
    userName: '复古玩家小王',
    averageRating: 4.7,
    totalReviews: 3,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 2 },
  },
  {
    userId: 'user3',
    userName: 'SFC收藏家',
    averageRating: 4.0,
    totalReviews: 1,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 },
  },
  {
    userId: 'user4',
    userName: 'GB爱好者',
    averageRating: 5.0,
    totalReviews: 2,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 },
  },
  {
    userId: 'user5',
    userName: '卡带猎人',
    averageRating: 4.0,
    totalReviews: 1,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 },
  },
  {
    userId: 'user6',
    userName: '怀旧游戏屋',
    averageRating: 4.5,
    totalReviews: 2,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
  },
  {
    userId: 'user7',
    userName: 'SFC老玩家',
    averageRating: 5.0,
    totalReviews: 1,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
  },
];

const collectorNames = [
  '像素收藏家', '复古玩家小王', 'SFC收藏家', 'GB爱好者', '卡带猎人',
  '怀旧游戏屋', 'SFC老玩家', 'FC典藏大师', 'MD骨灰粉', 'N64追梦人',
  'NGC时光机', 'Wii运动狂', 'GBA掌机王', 'NDS探险家', '3DS魔法师',
  'PS初代达人', 'PS2王者', 'PS3收藏家', 'PS4发烧友', 'PS5先锋',
  'Xbox元老', 'Xbox360战士', '世嘉土星控', 'DC梦想家', 'PCE精英',
  'NGPC掌机迷', 'WS奇妙旅', '雅达利古董商', 'ColecoVision迷',
  'Intellivision复古派', 'NeoGeo硬核党', 'Atari Jaguar猎藏',
  '3DO互动家', 'CD-i探险家', 'Amiga电脑迷', 'C64程序师',
  'ZX Spectrum藏', 'MSX收藏家', 'X68000精英', 'PC Engine Fan',
  'Game&Watch控', 'Virtual Boy狂', 'Tiger Electronics迷',
  'Neo Geo Pocket狂', 'WonderSwan彩', 'Game Gear狂',
  'Lynx亚得利迷', 'Nomad世嘉粉', 'Pokemon Mini狂',
];

const MAX_ACHIEVEMENTS = 12;

const generateCollectorData = (): CollectorLeaderboardEntry[] => {
  const collectors: Omit<CollectorLeaderboardEntry, 'rank' | 'prevRank' | 'totalScore' | 'collectionScore' | 'achievementScore' | 'exchangeScore'>[] = [];

  for (let i = 0; i < 50; i++) {
    const userId = `user${i + 1}`;
    const userName = collectorNames[i] || `收藏家${i + 1}`;
    const isTopUser = i < 5;
    const isMidUser = i >= 5 && i < 20;

    const collectionCount = isTopUser
      ? Math.floor(150 + Math.random() * 350)
      : isMidUser
      ? Math.floor(50 + Math.random() * 100)
      : Math.floor(5 + Math.random() * 50);

    const achievementsUnlocked = isTopUser
      ? Math.floor(8 + Math.random() * 5)
      : isMidUser
      ? Math.floor(4 + Math.random() * 5)
      : Math.floor(1 + Math.random() * 5);

    const exchangeReputation = isTopUser
      ? Math.round((4.5 + Math.random() * 0.5) * 10) / 10
      : isMidUser
      ? Math.round((3.5 + Math.random() * 1.0) * 10) / 10
      : Math.round((2.0 + Math.random() * 2.0) * 10) / 10;

    const completedExchanges = isTopUser
      ? Math.floor(20 + Math.random() * 80)
      : isMidUser
      ? Math.floor(5 + Math.random() * 25)
      : Math.floor(0 + Math.random() * 10);

    const daysAgo = Math.floor(Math.random() * 730) + 30;
    const joinedDate = new Date();
    joinedDate.setDate(joinedDate.getDate() - daysAgo);

    collectors.push({
      userId,
      userName,
      collectionCount,
      achievementsUnlocked: Math.min(achievementsUnlocked, MAX_ACHIEVEMENTS),
      achievementsTotal: MAX_ACHIEVEMENTS,
      exchangeReputation,
      completedExchanges,
      joinedAt: joinedDate.toISOString(),
    });
  }

  const maxCollection = Math.max(...collectors.map((c) => c.collectionCount));
  const maxExchanges = Math.max(...collectors.map((c) => c.completedExchanges));

  const withScores = collectors.map((c) => {
    const collectionScore = Math.round((c.collectionCount / maxCollection) * 1000);
    const achievementScore = Math.round((c.achievementsUnlocked / MAX_ACHIEVEMENTS) * 1000);
    const exchangeBase = (c.exchangeReputation / 5) * 500;
    const exchangeVolume = Math.min(c.completedExchanges / Math.max(maxExchanges, 1), 1) * 500;
    const exchangeScore = Math.round(exchangeBase + exchangeVolume);
    const totalScore = Math.round(collectionScore * 0.4 + achievementScore * 0.3 + exchangeScore * 0.3);

    return { ...c, collectionScore, achievementScore, exchangeScore, totalScore };
  });

  withScores.sort((a, b) => b.totalScore - a.totalScore);

  return withScores.map((c, idx) => ({
    ...c,
    rank: idx + 1,
    prevRank: idx + 1 + Math.floor(Math.random() * 5) - 2,
  }));
};

export const collectorLeaderboard: CollectorLeaderboardEntry[] = generateCollectorData();

export const accessories: Accessory[] = [
  {
    id: 'acc1',
    name: 'FC 原装手柄',
    category: 'CONTROLLER',
    platform: 'FC',
    series: '',
    manufacturer: '任天堂',
    condition: 'VERY_GOOD',
    isOfficial: true,
    isLimitedEdition: false,
    purchasePrice: 200,
    purchaseDate: '2023-05-10',
    releaseYear: 1983,
    quantity: 2,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20nintendo%20nes%20original%20controller%20pixel%20art&image_size=square',
    notes: '原装日版FC手柄，按键灵敏',
    tags: ['原装', '经典'],
    createdAt: '2023-05-10T00:00:00Z',
    updatedAt: '2023-05-10T00:00:00Z',
  },
  {
    id: 'acc2',
    name: '超级马里奥 完全攻略本',
    category: 'GUIDE_BOOK',
    platform: 'FC',
    series: '超级马里奥',
    manufacturer: '双叶社',
    condition: 'GOOD',
    isOfficial: true,
    isLimitedEdition: false,
    purchasePrice: 350,
    purchaseDate: '2023-07-22',
    releaseYear: 1986,
    quantity: 1,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20super%20mario%20guide%20book%20japanese%20pixel%20art&image_size=square',
    notes: '日版初代马里奥完全攻略，带地图',
    tags: ['攻略书', '日版'],
    createdAt: '2023-07-22T00:00:00Z',
    updatedAt: '2023-07-22T00:00:00Z',
  },
  {
    id: 'acc3',
    name: 'SFC 限定版手柄 塞尔达传说款',
    category: 'LIMITED_EDITION',
    platform: 'SFC',
    series: '塞尔达传说',
    manufacturer: '任天堂',
    condition: 'NEAR_MINT',
    isOfficial: true,
    isLimitedEdition: true,
    editionNumber: '0872/1500',
    purchasePrice: 1200,
    purchaseDate: '2023-11-18',
    releaseYear: 1991,
    quantity: 1,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zelda%20limited%20edition%20snes%20controller%20gold%20pixel%20art&image_size=square',
    notes: '塞尔达传说限定金色手柄，编号限量',
    tags: ['限定', '塞尔达', '收藏级'],
    createdAt: '2023-11-18T00:00:00Z',
    updatedAt: '2023-11-18T00:00:00Z',
  },
  {
    id: 'acc4',
    name: 'Game Boy 原装机身',
    category: 'CONSOLE',
    platform: 'GB',
    series: '',
    manufacturer: '任天堂',
    condition: 'VERY_GOOD',
    isOfficial: true,
    isLimitedEdition: false,
    purchasePrice: 600,
    purchaseDate: '2024-01-15',
    releaseYear: 1989,
    quantity: 1,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=original%20game%20boy%20console%20retro%20pixel%20art&image_size=square',
    notes: '初代GB厚机，屏幕已更换背光',
    tags: ['掌机', '原装'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'acc5',
    name: 'FF6 原声音乐CD',
    category: 'SOUNDTRACK',
    platform: 'SFC',
    series: '最终幻想',
    manufacturer: 'NTT出版',
    condition: 'NEAR_MINT',
    isOfficial: true,
    isLimitedEdition: false,
    purchasePrice: 450,
    purchaseDate: '2024-02-20',
    releaseYear: 1994,
    quantity: 1,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=final%20fantasy%20vi%20ost%20cd%20soundtrack%20retro%20pixel%20art&image_size=square',
    notes: '最终幻想VI原声大碟，3CD完整',
    tags: ['OST', '最终幻想'],
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'acc6',
    name: 'SFC 原装AV线',
    category: 'CABLE',
    platform: 'SFC',
    series: '',
    manufacturer: '任天堂',
    condition: 'GOOD',
    isOfficial: true,
    isLimitedEdition: false,
    purchasePrice: 80,
    purchaseDate: '2024-03-05',
    quantity: 2,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=retro%20snes%20av%20cable%20pixel%20art&image_size=square',
    notes: '原装SFC视频线，画质清晰',
    tags: ['线材'],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
];
