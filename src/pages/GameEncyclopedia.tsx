import { useState, useMemo } from 'react';
import { useStore } from '../stores/useStore';
import { useNavigate } from 'react-router-dom';
import type { EncyclopediaGame, EncyclopediaPlatform } from '../types';
import {
  BookOpen,
  Search,
  Check,
  X,
  Star,
  Calendar,
  Building2,
  Users,
  Trophy,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Heart,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

const platforms: EncyclopediaPlatform[] = [
  { name: 'FC', fullName: 'Family Computer (NES)', manufacturer: '任天堂', releaseYear: 1983, generation: '第三代', totalGames: 10, icon: '🎮', color: 'neon-red' },
  { name: 'SFC', fullName: 'Super Famicom (SNES)', manufacturer: '任天堂', releaseYear: 1990, generation: '第四代', totalGames: 10, icon: '🕹️', color: 'neon-purple' },
  { name: 'GB', fullName: 'Game Boy', manufacturer: '任天堂', releaseYear: 1989, generation: '掌机初代', totalGames: 8, icon: '📱', color: 'neon-green' },
  { name: 'MD', fullName: 'Mega Drive (Genesis)', manufacturer: '世嘉', releaseYear: 1988, generation: '第四代', totalGames: 5, icon: '🎯', color: 'neon-cyan' },
  { name: 'PS', fullName: 'PlayStation', manufacturer: '索尼', releaseYear: 1994, generation: '第五代', totalGames: 5, icon: '💿', color: 'neon-pink' },
  { name: 'N64', fullName: 'Nintendo 64', manufacturer: '任天堂', releaseYear: 1996, generation: '第五代', totalGames: 5, icon: '🎪', color: 'neon-amber' },
];

const encodePrompt = (p: string) => encodeURIComponent(p);
const img = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodePrompt(prompt)}&image_size=square`;

const encyclopediaGames: EncyclopediaGame[] = [
  {
    id: 'enc-fc-1', title: '超级马里奥兄弟', platform: 'FC', series: '超级马里奥', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1985, releaseDate: '1985-09-13', genre: ['平台跳跃', '动作'], sales: 40240000, rating: 9.5, isClassic: true,
    description: '定义了平台跳跃游戏类型的经典之作，拯救被酷霸王绑架的碧琪公主。',
    notableFeatures: ['第一款横版卷轴平台游戏', '引入库巴、碧琪公主等经典角色', '奠定了现代游戏设计基础'],
    coverImage: img('retro nintendo NES super mario bros game box pixel art japanese cover'),
  },
  {
    id: 'enc-fc-2', title: '塞尔达传说', platform: 'FC', series: '塞尔达传说', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1986, releaseDate: '1986-02-21', genre: ['动作冒险', 'RPG'], sales: 6510000, rating: 9.4, isClassic: true,
    description: '黄金卡带传奇，开放式世界冒险游戏的开山鼻祖，寻找三角力量拯救海拉鲁王国。',
    notableFeatures: ['开放式世界探索', '电池存档功能', '黄金卡带特别版'],
    coverImage: img('zelda 1 gold cartridge NES box art pixel art retro game'),
  },
  {
    id: 'enc-fc-3', title: '魂斗罗', platform: 'FC', series: '魂斗罗', publisher: '科乐美', developer: '科乐美',
    releaseYear: 1987, releaseDate: '1987-02-09', genre: ['射击', '动作'], sales: 4150000, rating: 9.0, isClassic: true,
    description: '经典双人射击游戏，上上下下左右左右BA开启30条命的传说。',
    notableFeatures: ['双人合作模式', '30条命秘技', '多方向射击系统'],
    coverImage: img('contra NES famicom game box art pixel art japanese retro'),
  },
  {
    id: 'enc-fc-4', title: '最终幻想', platform: 'FC', series: '最终幻想', publisher: '史克威尔', developer: '史克威尔',
    releaseYear: 1987, releaseDate: '1987-12-18', genre: ['角色扮演', 'RPG'], sales: 1300000, rating: 8.8, isClassic: true,
    description: '史克威尔的最后一搏，开创了日本RPG黄金时代的伟大系列。',
    notableFeatures: ['职业转换系统', '回合制战斗', '开创FF系列'],
    coverImage: img('final fantasy 1 NES famicom box art pixel art retro RPG'),
  },
  {
    id: 'enc-fc-5', title: '勇者斗恶龙', platform: 'FC', series: '勇者斗恶龙', publisher: '艾尼克斯', developer: 'Chunsoft',
    releaseYear: 1986, releaseDate: '1986-05-27', genre: ['角色扮演', 'RPG'], sales: 2500000, rating: 9.1, isClassic: true,
    description: '日本国民RPG的原点，鸟山明人设的经典传奇。',
    notableFeatures: ['日本RPG奠基之作', '鸟山明角色设计', '椙山浩一配乐'],
    coverImage: img('dragon quest 1 famicom box art pixel art Enix retro RPG'),
  },
  {
    id: 'enc-fc-6', title: '超级马里奥兄弟3', platform: 'FC', series: '超级马里奥', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1988, releaseDate: '1988-10-28', genre: ['平台跳跃', '动作'], sales: 18000000, rating: 9.7, isClassic: true,
    description: 'FC平台巅峰之作，加入多种变身道具和地图系统的超级马里奥进化版。',
    notableFeatures: ['8个世界大地图', '多种变身能力', '飞行能力首次登场'],
    coverImage: img('super mario bros 3 NES famicom box art pixel art classic'),
  },
  {
    id: 'enc-fc-7', title: '洛克人2', platform: 'FC', series: '洛克人', publisher: '卡普空', developer: '卡普空',
    releaseYear: 1988, releaseDate: '1988-12-24', genre: ['动作', '平台跳跃'], sales: 1510000, rating: 9.3, isClassic: true,
    description: '蓝之传说的巅峰，8大boss武器获取系统的经典确立。',
    notableFeatures: ['8位Boss武器系统', 'E罐能量系统', '系列最高难度代表作'],
    coverImage: img('megaman 2 NES box art pixel art Capcom blue hero'),
  },
  {
    id: 'enc-fc-8', title: '恶魔城', platform: 'FC', series: '恶魔城', publisher: '科乐美', developer: '科乐美',
    releaseYear: 1986, releaseDate: '1986-09-26', genre: ['动作', '平台跳跃'], sales: 1500000, rating: 8.9, isClassic: true,
    description: '吸血鬼猎人贝尔蒙特家族的传奇开端，鞭挞德古拉城堡。',
    notableFeatures: ['哥特式恐怖风格', '鞭子武器系统', '多种副武器'],
    coverImage: img('castlevania NES famicom box art pixel art gothic horror'),
  },
  {
    id: 'enc-fc-9', title: '双截龙', platform: 'FC', series: '双截龙', publisher: 'Technos Japan', developer: 'Technos Japan',
    releaseYear: 1987, releaseDate: '1987-04-08', genre: ['动作', '清版格斗'], sales: 1000000, rating: 8.6, isClassic: true,
    description: '清版格斗游戏的先驱，李兄弟拯救女友的街头战斗。',
    notableFeatures: ['双人合作清版', '多种武术招式', '街头格斗风格'],
    coverImage: img('double dragon NES box art pixel art beat em up retro'),
  },
  {
    id: 'enc-fc-10', title: '松鼠大战', platform: 'FC', series: '松鼠大战', publisher: '卡普空', developer: '卡普空',
    releaseYear: 1990, releaseDate: '1990-06-08', genre: ['平台跳跃', '动作'], sales: 1200000, rating: 8.7, isClassic: true,
    description: '迪士尼奇奇和蒂蒂的欢乐冒险，可以举起箱子砸向敌人。',
    notableFeatures: ['双人合作', '投掷物品系统', '迪士尼授权'],
    coverImage: img('chip dale rescue rangers NES box art pixel art disney'),
  },
  {
    id: 'enc-sfc-1', title: '超级马里奥世界', platform: 'SFC', series: '超级马里奥', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1990, releaseDate: '1990-11-21', genre: ['平台跳跃', '动作'], sales: 20610000, rating: 9.7, isClassic: true,
    description: 'SFC首发护航大作，耀西首次登场的经典平台游戏。',
    notableFeatures: ['耀西首次登场', '96个出口', '多路线探索'],
    coverImage: img('super mario world SNES box art pixel art yoshi classic'),
  },
  {
    id: 'enc-sfc-2', title: '塞尔达传说 众神的三角力量', platform: 'SFC', series: '塞尔达传说', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1991, releaseDate: '1991-11-21', genre: ['动作冒险', 'RPG'], sales: 4610000, rating: 9.8, isClassic: true,
    description: '光明与黑暗两个世界的宏大冒险，塞尔达系列2D巅峰。',
    notableFeatures: ['光暗双世界', '大师剑登场', '系列评价最高作品之一'],
    coverImage: img('zelda link to the past SNES box art pixel art master sword'),
  },
  {
    id: 'enc-sfc-3', title: '最终幻想VI', platform: 'SFC', series: '最终幻想', publisher: '史克威尔', developer: '史克威尔',
    releaseYear: 1994, releaseDate: '1994-04-02', genre: ['角色扮演', 'RPG'], sales: 3480000, rating: 9.9, isClassic: true,
    description: 'JRPG的最高峰，14位主角群像剧，魔导工业革命时代的悲歌。',
    notableFeatures: ['14位可操作主角', '魔导石系统', '歌剧名场面'],
    coverImage: img('final fantasy VI SNES box art pixel art JRPG classic opera'),
  },
  {
    id: 'enc-sfc-4', title: '勇者斗恶龙V', platform: 'SFC', series: '勇者斗恶龙', publisher: '艾尼克斯', developer: 'Chunsoft',
    releaseYear: 1992, releaseDate: '1992-09-27', genre: ['角色扮演', 'RPG'], sales: 2800000, rating: 9.6, isClassic: true,
    description: '天空三部曲第二部，跨越三代人的家族史诗，怪物同伴系统登场。',
    notableFeatures: ['亲子三代物语', '怪物同伴系统', '人生模拟RPG'],
    coverImage: img('dragon quest V SNES box art pixel art family epic sky trilogy'),
  },
  {
    id: 'enc-sfc-5', title: '街头霸王II', platform: 'SFC', series: '街头霸王', publisher: '卡普空', developer: '卡普空',
    releaseYear: 1992, releaseDate: '1992-06-10', genre: ['格斗'], sales: 6300000, rating: 9.5, isClassic: true,
    description: '定义格斗游戏类型的永恒经典，升龙拳、波动拳的诞生地。',
    notableFeatures: ['8位可选角色', '必杀技指令输入', '奠定格斗游戏规则'],
    coverImage: img('street fighter II SNES box art pixel art fighting game ryu ken'),
  },
  {
    id: 'enc-sfc-6', title: '超级银河战士', platform: 'SFC', series: '银河战士', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1994, releaseDate: '1994-03-19', genre: ['动作冒险', '探索'], sales: 1420000, rating: 9.7, isClassic: true,
    description: '银河城类型的命名来源之一，萨姆斯阿兰的孤独星球探索。',
    notableFeatures: ['地图探索玩法', '能力解锁推进', '孤独星球氛围'],
    coverImage: img('super metroid SNES box art pixel art samus aran sci-fi'),
  },
  {
    id: 'enc-sfc-7', title: '洛克人X', platform: 'SFC', series: '洛克人', publisher: '卡普空', developer: '卡普空',
    releaseYear: 1993, releaseDate: '1993-12-17', genre: ['动作', '平台跳跃'], sales: 1160000, rating: 9.4, isClassic: true,
    description: '新时代的蓝色英雄，艾克斯和杰洛的觉醒，冲刺和墙壁跳跃加入。',
    notableFeatures: ['冲刺技能', '装甲强化系统', '杰洛首次登场'],
    coverImage: img('megaman X SNES box art pixel art blue maverick hunter'),
  },
  {
    id: 'enc-sfc-8', title: '火焰纹章 纹章之谜', platform: 'SFC', series: '火焰纹章', publisher: '任天堂', developer: 'Intelligent Systems',
    releaseYear: 1994, releaseDate: '1994-01-21', genre: ['策略角色扮演', 'SRPG'], sales: 780000, rating: 9.2, isClassic: true,
    description: 'SRPG经典之作，马尔斯王子的复国之旅，永久死亡的策略深度。',
    notableFeatures: ['永久死亡机制', '职业转职系统', '战棋策略玩法'],
    coverImage: img('fire emblem SNES box art pixel art tactical RPG marth'),
  },
  {
    id: 'enc-sfc-9', title: '时空之轮', platform: 'SFC', series: '时空之轮', publisher: '史克威尔', developer: '史克威尔',
    releaseYear: 1995, releaseDate: '1995-03-11', genre: ['角色扮演', 'RPG'], sales: 2650000, rating: 9.9, isClassic: true,
    description: '梦幻团队打造的穿越时空的奇迹，鸟山明+坂口博信+堀井雄二。',
    notableFeatures: ['时空穿越剧情', '无随机遇敌', '多重结局系统'],
    coverImage: img('chrono trigger SNES box art pixel art time travel JRPG'),
  },
  {
    id: 'enc-sfc-10', title: '最终幻想V', platform: 'SFC', series: '最终幻想', publisher: '史克威尔', developer: '史克威尔',
    releaseYear: 1992, releaseDate: '1992-12-09', genre: ['角色扮演', 'RPG'], sales: 2450000, rating: 9.0, isClassic: true,
    description: '职业系统巅峰，22种职业自由组合的策略乐趣。',
    notableFeatures: ['深度职业系统', '青魔法师', '必杀技limit'],
    coverImage: img('final fantasy V SNES box art pixel art job system JRPG'),
  },
  {
    id: 'enc-gb-1', title: '口袋妖怪 红/绿', platform: 'GB', series: '口袋妖怪', publisher: '任天堂', developer: 'Game Freak',
    releaseYear: 1996, releaseDate: '1996-02-27', genre: ['角色扮演', '收集'], sales: 31370000, rating: 9.5, isClassic: true,
    description: '全球流行文化现象，151只口袋妖怪的收集冒险从这里开始。',
    notableFeatures: ['151只妖怪', '通信交换进化', '随机遇敌捕捉'],
    coverImage: img('pokemon red gameboy box art pixel art pikachu starter'),
  },
  {
    id: 'enc-gb-2', title: '星之卡比', platform: 'GB', series: '星之卡比', publisher: '任天堂', developer: 'HAL研究所',
    releaseYear: 1992, releaseDate: '1992-04-27', genre: ['平台跳跃', '动作'], sales: 5130000, rating: 8.8, isClassic: true,
    description: '粉色恶魔的首次登场，吸入敌人获得能力的轻松平台游戏。',
    notableFeatures: ['吸入复制能力', '多难度选择', '粉色主角'],
    coverImage: img('kirby dream land gameboy box art pixel art pink puffball'),
  },
  {
    id: 'enc-gb-3', title: '超级马里奥大陆', platform: 'GB', series: '超级马里奥', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1989, releaseDate: '1989-04-21', genre: ['平台跳跃', '动作'], sales: 18140000, rating: 8.6, isClassic: true,
    description: '掌机马里奥首秀，GB首发护航游戏之一。',
    notableFeatures: ['GB首发护航', '掌机平台跳跃', '独特世界观'],
    coverImage: img('super mario land gameboy box art pixel art portable mario'),
  },
  {
    id: 'enc-gb-4', title: '俄罗斯方块', platform: 'GB', series: '俄罗斯方块', publisher: '任天堂', developer: 'Bullet-Proof Software',
    releaseYear: 1989, releaseDate: '1989-06-14', genre: ['益智', '解谜'], sales: 35000000, rating: 9.2, isClassic: true,
    description: '全球最畅销游戏，GB捆绑发售的永恒经典。',
    notableFeatures: ['史上最畅销游戏', '捆绑GB发售', '简单但深奥'],
    coverImage: img('tetris gameboy box art pixel art classic puzzle'),
  },
  {
    id: 'enc-gb-5', title: '塞尔达传说 织梦岛', platform: 'GB', series: '塞尔达传说', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1993, releaseDate: '1993-06-06', genre: ['动作冒险', 'RPG'], sales: 3830000, rating: 9.3, isClassic: true,
    description: '梦见岛上的奇幻冒险，可湖霖岛的秘密。',
    notableFeatures: ['非海拉鲁舞台', '丰富解谜元素', '感人剧情'],
    coverImage: img('zelda links awakening gameboy box art pixel art dream island'),
  },
  {
    id: 'enc-gb-6', title: '口袋妖怪 金/银', platform: 'GB', series: '口袋妖怪', publisher: '任天堂', developer: 'Game Freak',
    releaseYear: 1999, releaseDate: '1999-11-21', genre: ['角色扮演', '收集'], sales: 23100000, rating: 9.6, isClassic: true,
    description: '第二世代口袋妖怪，城都地区的全新冒险，实时昼夜系统。',
    notableFeatures: ['251只妖怪', '实时昼夜系统', '双地图联动'],
    coverImage: img('pokemon gold silver gameboy box art pixel art johto region'),
  },
  {
    id: 'enc-gb-7', title: '火焰纹章 外传', platform: 'GB', series: '火焰纹章', publisher: '任天堂', developer: 'Intelligent Systems',
    releaseYear: 1992, releaseDate: '1992-03-14', genre: ['策略角色扮演', 'SRPG'], sales: 3240000, rating: 8.9, isClassic: true,
    description: '阿鲁姆和塞莉卡的双主角战棋冒险。',
    notableFeatures: ['双主角系统', '自由探索地图', '转职系统'],
    coverImage: img('fire emblem gaiden NES box art pixel art tactical RPG'),
  },
  {
    id: 'enc-gb-8', title: '瓦里奥大陆', platform: 'GB', series: '瓦里奥大陆', publisher: '任天堂', developer: '任天堂R&D1',
    releaseYear: 1994, releaseDate: '1994-01-21', genre: ['平台跳跃', '动作'], sales: 4000000, rating: 8.7, isClassic: true,
    description: '贪婪的瓦里奥反客为主，宝藏猎人的冒险。',
    notableFeatures: ['反英雄主角', '收集金币系统', '多种头盔能力'],
    coverImage: img('warioland gameboy box art pixel art treasure hunter'),
  },
  {
    id: 'enc-md-1', title: '索尼克', platform: 'MD', series: '索尼克', publisher: '世嘉', developer: '世嘉Sonic Team',
    releaseYear: 1991, releaseDate: '1991-06-23', genre: ['平台跳跃', '动作'], sales: 15000000, rating: 9.0, isClassic: true,
    description: '世嘉吉祥物首秀，蓝色刺猬的速度革命。',
    notableFeatures: ['极致速度感', '世嘉吉祥物', 'MD代表作'],
    coverImage: img('sonic the hedgehog genesis box art pixel art blue blur'),
  },
  {
    id: 'enc-md-2', title: '怒之铁拳2', platform: 'MD', series: '怒之铁拳', publisher: '世嘉', developer: '世嘉',
    releaseYear: 1992, releaseDate: '1992-12-24', genre: ['动作', '清版格斗'], sales: 1500000, rating: 9.2, isClassic: true,
    description: 'MD最佳清版格斗，四人合作镇压街头暴力。',
    notableFeatures: ['四人合作', '丰富招式', '古川元亮配乐'],
    coverImage: img('streets of rage 2 genesis box art pixel art beat em up'),
  },
  {
    id: 'enc-md-3', title: '梦幻之星4', platform: 'MD', series: '梦幻之星', publisher: '世嘉', developer: '世嘉',
    releaseYear: 1993, releaseDate: '1993-12-17', genre: ['角色扮演', 'RPG'], sales: 850000, rating: 9.3, isClassic: true,
    description: '世嘉RPG的最高杰作，科幻宇宙的千年轮回。',
    notableFeatures: ['组合技系统', '科幻世界观', '系列巅峰'],
    coverImage: img('phantasy star IV genesis box art pixel art sci-fi RPG'),
  },
  {
    id: 'enc-md-4', title: '火枪英雄', platform: 'MD', series: '火枪英雄', publisher: '世嘉', developer: 'Treasure',
    releaseYear: 1993, releaseDate: '1993-09-10', genre: ['射击', '动作'], sales: 600000, rating: 9.1, isClassic: true,
    description: 'Treasure开发的MD经典射击，七种武器组合。',
    notableFeatures: ['七种武器组合', '疯狂BOSS战', 'Treasure成名作'],
    coverImage: img('gunstar heroes genesis box art pixel art shooter treasure'),
  },
  {
    id: 'enc-md-5', title: '超级忍2', platform: 'MD', series: '超级忍', publisher: '世嘉', developer: '世嘉',
    releaseYear: 1993, releaseDate: '1993-07-23', genre: ['动作', '平台跳跃'], sales: 500000, rating: 8.9, isClassic: true,
    description: '服部半藏的忍者传说，秀真的复仇之旅。',
    notableFeatures: ['忍者动作', '体术与忍术', '高速战斗'],
    coverImage: img('shinobi III genesis box art pixel art ninja action'),
  },
  {
    id: 'enc-ps-1', title: '最终幻想VII', platform: 'PS', series: '最终幻想', publisher: '史克威尔', developer: '史克威尔',
    releaseYear: 1997, releaseDate: '1997-01-31', genre: ['角色扮演', 'RPG'], sales: 13900000, rating: 9.8, isClassic: true,
    description: '3D CG电影化RPG的革命，克劳德和萨菲罗斯的永恒对决。',
    notableFeatures: ['3D CG过场动画', '魔晶石系统', '克劳德vs萨菲罗斯'],
    coverImage: img('final fantasy VII PS1 box art pixel art cloud strife RPG'),
  },
  {
    id: 'enc-ps-2', title: '合金装备', platform: 'PS', series: '合金装备', publisher: '科乐美', developer: '科乐美',
    releaseYear: 1998, releaseDate: '1998-09-03', genre: ['潜行', '动作'], sales: 6000000, rating: 9.7, isClassic: true,
    description: '战术谍报动作游戏的金字塔，小岛秀夫的电影化游戏。',
    notableFeatures: ['潜行游戏类型', '电影化叙事', '打破第四面墙'],
    coverImage: img('metal gear solid PS1 box art pixel art stealth snake'),
  },
  {
    id: 'enc-ps-3', title: '生化危机2', platform: 'PS', series: '生化危机', publisher: '卡普空', developer: '卡普空',
    releaseYear: 1998, releaseDate: '1998-01-21', genre: ['恐怖', '生存'], sales: 5820000, rating: 9.5, isClassic: true,
    description: '浣熊市的噩梦，里昂和克莱尔的双主角生存恐怖。',
    notableFeatures: ['双主角剧情', '僵尸生存恐怖', '浣熊市事件'],
    coverImage: img('resident evil 2 PS1 box art pixel art leon claire zombie'),
  },
  {
    id: 'enc-ps-4', title: '勇者斗恶龙VII', platform: 'PS', series: '勇者斗恶龙', publisher: '艾尼克斯', developer: 'Heartbeat',
    releaseYear: 2000, releaseDate: '2000-08-26', genre: ['角色扮演', 'RPG'], sales: 4110000, rating: 9.2, isClassic: true,
    description: '伊甸战士的记忆，复活失落大陆的漫长旅途。',
    notableFeatures: ['复活大陆系统', '超长篇剧情', '职业系统回归'],
    coverImage: img('dragon quest VII PS1 box art pixel art eden warriors'),
  },
  {
    id: 'enc-ps-5', title: '牧场物语 回归自然', platform: 'PS', series: '牧场物语', publisher: '维克多', developer: 'Marvelous',
    releaseYear: 1999, releaseDate: '1999-12-16', genre: ['模拟', '经营'], sales: 500000, rating: 8.9, isClassic: true,
    description: '悠闲的乡村生活，种田、养牛、谈恋爱。',
    notableFeatures: ['模拟农场经营', '恋爱结婚系统', '治愈系游戏'],
    coverImage: img('harvest moon PS1 box art pixel art farming sim'),
  },
  {
    id: 'enc-n64-1', title: '超级马里奥64', platform: 'N64', series: '超级马里奥', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1996, releaseDate: '1996-06-23', genre: ['平台跳跃', '动作'], sales: 11890000, rating: 9.9, isClassic: true,
    description: '3D平台游戏的教科书，定义了3D游戏操作方式。',
    notableFeatures: ['首款3D马里奥', '模拟摇杆操作', '120颗力量之星'],
    coverImage: img('super mario 64 N64 box art pixel art 3D platformer'),
  },
  {
    id: 'enc-n64-2', title: '塞尔达传说 时之笛', platform: 'N64', series: '塞尔达传说', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1998, releaseDate: '1998-11-21', genre: ['动作冒险', 'RPG'], sales: 7600000, rating: 10.0, isClassic: true,
    description: '游戏史上的最高杰作，时之勇者林克的七年冒险。',
    notableFeatures: ['Z锁定系统', '时之笛穿越', '史上评分最高游戏'],
    coverImage: img('zelda ocarina of time N64 box art pixel art link master sword'),
  },
  {
    id: 'enc-n64-3', title: '马里奥赛车64', platform: 'N64', series: '马里奥赛车', publisher: '任天堂', developer: '任天堂情报开发本部',
    releaseYear: 1996, releaseDate: '1996-12-14', genre: ['竞速', '派对'], sales: 9870000, rating: 9.2, isClassic: true,
    description: '四人对战卡丁车，红蓝龟壳的欢乐派对。',
    notableFeatures: ['四人分屏对战', '红蓝龟壳道具', '16条赛道'],
    coverImage: img('mario kart 64 N64 box art pixel art racing party'),
  },
  {
    id: 'enc-n64-4', title: '任天堂明星大乱斗', platform: 'N64', series: '任天堂明星大乱斗', publisher: '任天堂', developer: 'HAL研究所',
    releaseYear: 1999, releaseDate: '1999-01-21', genre: ['格斗', '派对'], sales: 5550000, rating: 9.0, isClassic: true,
    description: '全明星角色集结，樱井政博开创的另类格斗。',
    notableFeatures: ['任天堂全明星', '百分比击飞系统', '四人派对'],
    coverImage: img('super smash bros N64 box art pixel art nintendo all stars'),
  },
  {
    id: 'enc-n64-5', title: '黄金眼007', platform: 'N64', series: '黄金眼', publisher: '任天堂', developer: 'Rare',
    releaseYear: 1997, releaseDate: '1997-08-25', genre: ['射击', 'FPS'], sales: 8090000, rating: 9.3, isClassic: true,
    description: '007电影改编，主机FPS的开拓者。',
    notableFeatures: ['主机FPS先驱', '多人分屏死斗', '多种任务目标'],
    coverImage: img('goldeneye 007 N64 box art pixel art FPS james bond'),
  },
];

const GameEncyclopedia = () => {
  const navigate = useNavigate();
  const { cartridges, isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useStore();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOwned, setFilterOwned] = useState<'ALL' | 'OWNED' | 'MISSING'>('ALL');
  const [selectedGame, setSelectedGame] = useState<EncyclopediaGame | null>(null);

  const ownedTitles = useMemo(() => {
    return new Set(cartridges.map((c) => `${c.title.toLowerCase()}_${c.platform.toLowerCase()}`));
  }, [cartridges]);

  const isOwned = (title: string, platform: string) => {
    return ownedTitles.has(`${title.toLowerCase()}_${platform.toLowerCase()}`);
  };

  const filteredGames = useMemo(() => {
    return encyclopediaGames.filter((game) => {
      if (selectedPlatform !== 'ALL' && game.platform !== selectedPlatform) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !game.title.toLowerCase().includes(q) &&
          !game.series.toLowerCase().includes(q) &&
          !game.publisher.toLowerCase().includes(q) &&
          !game.developer.toLowerCase().includes(q)
        ) return false;
      }
      const owned = isOwned(game.title, game.platform);
      if (filterOwned === 'OWNED' && !owned) return false;
      if (filterOwned === 'MISSING' && owned) return false;
      return true;
    });
  }, [selectedPlatform, searchQuery, filterOwned, ownedTitles]);

  const gamesByPlatform = useMemo(() => {
    const grouped: Record<string, EncyclopediaGame[]> = {};
    filteredGames.forEach((game) => {
      if (!grouped[game.platform]) grouped[game.platform] = [];
      grouped[game.platform].push(game);
    });
    return grouped;
  }, [filteredGames]);

  const totalStats = useMemo(() => {
    const total = encyclopediaGames.length;
    let owned = 0;
    encyclopediaGames.forEach((g) => {
      if (isOwned(g.title, g.platform)) owned++;
    });
    return { total, owned, missing: total - owned, percent: total > 0 ? Math.round((owned / total) * 100) : 0 };
  }, [ownedTitles]);

  const formatSales = (sales: number) => {
    if (sales >= 10000000) return `${(sales / 10000000).toFixed(1)}千万`;
    if (sales >= 10000) return `${(sales / 10000).toFixed(0)}万`;
    return sales.toLocaleString();
  };

  const toggleWishlist = (game: EncyclopediaGame) => {
    const inWishlist = isInWishlist(game.title, game.platform);
    if (inWishlist) {
      const itemId = getWishlistItemId(game.title, game.platform);
      if (itemId) removeFromWishlist(itemId);
    } else {
      addToWishlist({
        cartridgeTitle: game.title,
        platform: game.platform,
        coverImage: game.coverImage,
        priority: 'HIGH',
      });
    }
  };

  const goToCollection = () => navigate('/collection');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-pixel text-xl text-white neon-glow-cyan flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              游戏百科
            </h1>
            <p className="font-retro text-gray-400 text-lg mt-1">
              按平台分类浏览经典游戏，追踪你的收藏进度
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-card-border rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-pixel p-4 rounded-lg">
            <p className="font-retro text-gray-400 text-sm">收录游戏</p>
            <p className="font-pixel text-2xl text-white mt-1">{totalStats.total}</p>
          </div>
          <div className="card-pixel p-4 rounded-lg border-neon-green/30">
            <p className="font-retro text-neon-green text-sm">已收藏</p>
            <p className="font-pixel text-2xl text-neon-green mt-1 flex items-center gap-2">
              <Check className="w-5 h-5" />
              {totalStats.owned}
            </p>
          </div>
          <div className="card-pixel p-4 rounded-lg border-neon-red/30">
            <p className="font-retro text-neon-red text-sm">未收藏</p>
            <p className="font-pixel text-2xl text-neon-red mt-1 flex items-center gap-2">
              <X className="w-5 h-5" />
              {totalStats.missing}
            </p>
          </div>
          <div className="card-pixel p-4 rounded-lg border-neon-purple/30">
            <p className="font-retro text-neon-purple text-sm">完成度</p>
            <p className="font-pixel text-2xl text-neon-purple mt-1">{totalStats.percent}%</p>
            <div className="w-full bg-darker-navy h-2 rounded mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-500"
                style={{ width: `${totalStats.percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card-pixel p-4 rounded-lg mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="搜索游戏名称、系列、发行商、开发商..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 font-retro text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterOwned}
                  onChange={(e) => setFilterOwned(e.target.value as any)}
                  className="font-retro text-sm"
                >
                  <option value="ALL">全部游戏</option>
                  <option value="OWNED">已收藏</option>
                  <option value="MISSING">未收藏</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedPlatform('ALL')}
            className={`px-4 py-2 font-retro text-sm rounded-lg border-2 transition-all ${
              selectedPlatform === 'ALL'
                ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                : 'bg-card-bg border-card-border text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            全部平台
          </button>
          {platforms.map((p) => {
            const platformGames = encyclopediaGames.filter((g) => g.platform === p.name);
            const ownedCount = platformGames.filter((g) => isOwned(g.title, g.platform)).length;
            return (
              <button
                key={p.name}
                onClick={() => setSelectedPlatform(p.name)}
                className={`px-4 py-2 font-retro text-sm rounded-lg border-2 transition-all flex items-center gap-2 ${
                  selectedPlatform === p.name
                    ? 'bg-neon-purple/20 border-neon-purple text-neon-purple'
                    : 'bg-card-bg border-card-border text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  selectedPlatform === p.name ? 'bg-neon-purple/30' : 'bg-gray-700'
                }`}>
                  {ownedCount}/{platformGames.length}
                </span>
              </button>
            );
          })}
        </div>

        {selectedPlatform !== 'ALL' && (
          <div className="card-pixel p-5 rounded-lg mb-6 border-neon-purple/30">
            {(() => {
              const p = platforms.find((pf) => pf.name === selectedPlatform)!;
              const pGames = encyclopediaGames.filter((g) => g.platform === p.name);
              const owned = pGames.filter((g) => isOwned(g.title, g.platform)).length;
              return (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-5xl">{p.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-pixel text-lg text-white">{p.fullName}</h3>
                    <p className="font-retro text-gray-400 text-sm mt-1">
                      {p.manufacturer} · {p.generation} · {p.releaseYear}年发售
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-retro text-sm text-neon-green">
                        已收藏 {owned}/{pGames.length}
                      </span>
                      <div className="w-40 bg-darker-navy h-2 rounded overflow-hidden">
                        <div
                          className="h-full bg-neon-green"
                          style={{ width: `${pGames.length > 0 ? (owned / pGames.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {filteredGames.length === 0 ? (
          <div className="card-pixel p-12 rounded-lg text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="font-retro text-gray-400">没有找到匹配的游戏</p>
          </div>
        ) : selectedPlatform !== 'ALL' ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  owned={isOwned(game.title, game.platform)}
                  inWishlist={isInWishlist(game.title, game.platform)}
                  formatSales={formatSales}
                  onClick={() => setSelectedGame(game)}
                  onToggleWishlist={() => toggleWishlist(game)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGames.map((game) => (
                <GameRow
                  key={game.id}
                  game={game}
                  owned={isOwned(game.title, game.platform)}
                  inWishlist={isInWishlist(game.title, game.platform)}
                  formatSales={formatSales}
                  onClick={() => setSelectedGame(game)}
                  onToggleWishlist={() => toggleWishlist(game)}
                  goToCollection={goToCollection}
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-8">
            {Object.keys(gamesByPlatform)
              .sort((a, b) => {
                const order = ['FC', 'MD', 'GB', 'SFC', 'PS', 'N64'];
                return order.indexOf(a) - order.indexOf(b);
              })
              .map((platformName) => {
                const p = platforms.find((pf) => pf.name === platformName);
                const platformGames = gamesByPlatform[platformName];
                const ownedCount = platformGames.filter((g) => isOwned(g.title, g.platform)).length;
                return (
                  <div key={platformName}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{p?.icon}</span>
                      <h2 className="font-pixel text-lg text-white">
                        {platformName}
                        <span className="text-gray-500 font-retro text-sm ml-2">
                          {p?.fullName}
                        </span>
                      </h2>
                      <span className={`px-2 py-1 font-retro text-xs rounded ${
                        ownedCount === platformGames.length
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-neon-amber/20 text-neon-amber'
                      }`}>
                        {ownedCount}/{platformGames.length} 已收集
                      </span>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {platformGames.map((game) => (
                          <GameCard
                            key={game.id}
                            game={game}
                            owned={isOwned(game.title, game.platform)}
                            inWishlist={isInWishlist(game.title, game.platform)}
                            formatSales={formatSales}
                            onClick={() => setSelectedGame(game)}
                            onToggleWishlist={() => toggleWishlist(game)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {platformGames.map((game) => (
                          <GameRow
                            key={game.id}
                            game={game}
                            owned={isOwned(game.title, game.platform)}
                            inWishlist={isInWishlist(game.title, game.platform)}
                            formatSales={formatSales}
                            onClick={() => setSelectedGame(game)}
                            onToggleWishlist={() => toggleWishlist(game)}
                            goToCollection={goToCollection}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {selectedGame && (
          <GameDetailModal
            game={selectedGame}
            owned={isOwned(selectedGame.title, selectedGame.platform)}
            inWishlist={isInWishlist(selectedGame.title, selectedGame.platform)}
            formatSales={formatSales}
            onClose={() => setSelectedGame(null)}
            onToggleWishlist={() => toggleWishlist(selectedGame)}
            goToCollection={goToCollection}
          />
        )}
      </div>
    </div>
  );
};

interface GameCardProps {
  game: EncyclopediaGame;
  owned: boolean;
  inWishlist: boolean;
  formatSales: (n: number) => string;
  onClick: () => void;
  onToggleWishlist: () => void;
}

const GameCard = ({ game, owned, inWishlist, formatSales, onClick, onToggleWishlist }: GameCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`card-pixel rounded-lg overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] ${
        owned ? 'ring-2 ring-neon-green ring-opacity-60' : ''
      }`}
    >
      <div className="relative aspect-square">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        {owned && (
          <div className="absolute top-2 left-2 bg-neon-green text-white px-2 py-1 rounded font-pixel text-[10px] flex items-center gap-1">
            <Check className="w-3 h-3" />
            已收藏
          </div>
        )}
        {!owned && inWishlist && (
          <div className="absolute top-2 left-2 bg-neon-pink text-white px-2 py-1 rounded font-pixel text-[10px] flex items-center gap-1">
            <Heart className="w-3 h-3 fill-current" />
            愿望单
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded flex items-center justify-center transition-all ${
            inWishlist
              ? 'bg-neon-pink/80 text-white'
              : 'bg-black/50 text-gray-300 hover:bg-black/70 hover:text-neon-pink opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex items-center gap-1">
            {game.genre.slice(0, 2).map((g) => (
              <span key={g} className="px-1.5 py-0.5 bg-neon-purple/40 text-neon-purple text-[9px] font-pixel rounded">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-pixel text-sm text-white truncate group-hover:text-neon-cyan transition-colors">
          {game.title}
        </h3>
        <p className="font-retro text-xs text-gray-500 mt-1 flex items-center gap-1">
          <span className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px]">{game.platform}</span>
          <span>·</span>
          <span>{game.releaseYear}</span>
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-neon-amber">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-pixel text-xs">{game.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Users className="w-3 h-3" />
            <span className="font-retro text-[10px]">{formatSales(game.sales)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GameRowProps {
  game: EncyclopediaGame;
  owned: boolean;
  inWishlist: boolean;
  formatSales: (n: number) => string;
  onClick: () => void;
  onToggleWishlist: () => void;
  goToCollection: () => void;
}

const GameRow = ({ game, owned, inWishlist, formatSales, onClick, onToggleWishlist, goToCollection }: GameRowProps) => {
  return (
    <div
      onClick={onClick}
      className={`card-pixel rounded-lg p-4 flex items-center gap-4 group cursor-pointer transition-all hover:border-neon-purple/50 ${
        owned ? 'ring-2 ring-neon-green ring-opacity-40' : ''
      }`}
    >
      <img src={game.coverImage} alt={game.title} className="w-16 h-16 object-cover rounded shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-pixel text-sm text-white group-hover:text-neon-cyan transition-colors">
            {game.title}
          </h3>
          {owned && (
            <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green font-pixel text-[10px] rounded flex items-center gap-1">
              <Check className="w-3 h-3" />
              已收藏
            </span>
          )}
          {!owned && inWishlist && (
            <span className="px-2 py-0.5 bg-neon-pink/20 text-neon-pink font-pixel text-[10px] rounded flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" />
              愿望单
            </span>
          )}
          {game.isClassic && (
            <span className="px-2 py-0.5 bg-neon-amber/20 text-neon-amber font-pixel text-[10px] rounded flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              经典
            </span>
          )}
        </div>
        <p className="font-retro text-xs text-gray-400 mt-1">
          <span className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] mr-1">{game.platform}</span>
          {game.series} · {game.publisher} · {game.developer}
        </p>
        <p className="font-retro text-xs text-gray-500 mt-1 line-clamp-1">
          {game.description}
        </p>
      </div>
      <div className="hidden md:flex items-center gap-6 shrink-0">
        <div className="text-center">
          <div className="flex items-center gap-1 text-neon-amber">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-pixel text-sm">{game.rating}</span>
          </div>
          <p className="font-retro text-[10px] text-gray-500 mt-0.5">评分</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-gray-300">
            <Calendar className="w-4 h-4" />
            <span className="font-pixel text-sm">{game.releaseYear}</span>
          </div>
          <p className="font-retro text-[10px] text-gray-500 mt-0.5">发售</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-gray-300">
            <Users className="w-4 h-4" />
            <span className="font-pixel text-sm">{formatSales(game.sales)}</span>
          </div>
          <p className="font-retro text-[10px] text-gray-500 mt-0.5">销量</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
            inWishlist
              ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-neon-pink hover:border-neon-pink/50'
          }`}
          title={inWishlist ? '从愿望单移除' : '加入愿望单'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        {owned && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToCollection();
            }}
            className="w-9 h-9 rounded bg-neon-green/20 text-neon-green border border-neon-green/50 flex items-center justify-center hover:bg-neon-green/30 transition-all"
            title="查看我的收藏"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

interface GameDetailModalProps {
  game: EncyclopediaGame;
  owned: boolean;
  inWishlist: boolean;
  formatSales: (n: number) => string;
  onClose: () => void;
  onToggleWishlist: () => void;
  goToCollection: () => void;
}

const GameDetailModal = ({ game, owned, inWishlist, formatSales, onClose, onToggleWishlist, goToCollection }: GameDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="card-pixel rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 overflow-hidden">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-full h-full object-cover opacity-50 blur-sm"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-16 left-6 flex items-end gap-4">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-32 h-32 object-cover rounded-lg border-4 border-darker-navy shadow-2xl"
            />
            <div className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {owned && (
                  <span className="px-2 py-1 bg-neon-green/30 text-neon-green border border-neon-green/50 font-pixel text-xs rounded flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    已收藏
                  </span>
                )}
                {game.isClassic && (
                  <span className="px-2 py-1 bg-neon-amber/30 text-neon-amber border border-neon-amber/50 font-pixel text-xs rounded flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    必玩经典
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-700 text-gray-300 font-pixel text-xs rounded">
                  {game.platform}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          <h2 className="font-pixel text-xl text-white">{game.title}</h2>
          <p className="font-retro text-gray-400 mt-1">
            {game.series} 系列 · 发行商：{game.publisher}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-darker-navy rounded-lg p-3 border border-card-border">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-retro text-xs">发售日期</span>
              </div>
              <p className="font-pixel text-sm text-white">{game.releaseDate}</p>
            </div>
            <div className="bg-darker-navy rounded-lg p-3 border border-card-border">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="font-retro text-xs">开发商</span>
              </div>
              <p className="font-pixel text-sm text-white truncate">{game.developer}</p>
            </div>
            <div className="bg-darker-navy rounded-lg p-3 border border-card-border">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="font-retro text-xs">全球销量</span>
              </div>
              <p className="font-pixel text-sm text-neon-cyan">{formatSales(game.sales)}</p>
            </div>
            <div className="bg-darker-navy rounded-lg p-3 border border-card-border">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Star className="w-4 h-4" />
                <span className="font-retro text-xs">玩家评分</span>
              </div>
              <p className="font-pixel text-sm text-neon-amber flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                {game.rating}/10
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-pixel text-sm text-white mb-2 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-neon-cyan" />
              游戏简介
            </h3>
            <p className="font-retro text-gray-300 leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="mt-5">
            <h3 className="font-pixel text-sm text-white mb-2 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-neon-cyan" />
              类型标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {game.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1.5 bg-neon-purple/15 text-neon-purple font-retro text-sm rounded border border-neon-purple/30"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="font-pixel text-sm text-white mb-2 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-neon-cyan" />
              经典特色
            </h3>
            <ul className="space-y-2">
              {game.notableFeatures.map((feature, idx) => (
                <li key={idx} className="font-retro text-gray-300 flex items-start gap-2">
                  <span className="text-neon-green mt-0.5">◆</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-card-border flex flex-wrap gap-3">
            <button
              onClick={onToggleWishlist}
              className={`pixel-btn text-xs flex items-center gap-2 ${
                inWishlist ? 'pixel-btn-pink' : 'pixel-btn-cyan'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              {inWishlist ? '从愿望单移除' : '加入愿望单'}
            </button>
            {owned && (
              <button
                onClick={goToCollection}
                className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                查看我的收藏
              </button>
            )}
            {!owned && (
              <button
                onClick={goToCollection}
                className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加到藏品库
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEncyclopedia;