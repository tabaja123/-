
import { EmotionDefinition, ToolBank, ThoughtPair } from './types';

export const EMOTIONS: EmotionDefinition[] = [
  { id: '1', name: 'فرح', imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=150' },
  { id: '2', name: 'غضب', imageUrl: 'https://images.unsplash.com/photo-1584940120743-8981ca35b012?q=80&w=150' },
  { id: '3', name: 'حزن', imageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=150' },
  { id: '4', name: 'خوف', imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=150' },
  { id: '5', name: 'احباط', imageUrl: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=150' },
  { id: '6', name: 'خجل', imageUrl: 'https://images.unsplash.com/photo-1520694478166-daaaa491c19d?q=80&w=150' },
  { id: '7', name: 'رفض', imageUrl: 'https://images.unsplash.com/photo-1594633215907-7e617d91d1e4?q=80&w=150' },
  { id: '8', name: 'ازدراء', imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae6d?q=80&w=150' },
  { id: '9', name: 'حماس', imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=150' },
  { id: '10', name: 'راحة', imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=150' },
  { id: '11', name: 'فخر', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=150' },
  { id: '12', name: 'ذنب', imageUrl: 'https://images.unsplash.com/photo-1502641470433-28956903d3c8?q=80&w=150' },
  { id: '13', name: 'حسد', imageUrl: 'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fe?q=80&w=150' },
  { id: '14', name: 'ملل', imageUrl: 'https://images.unsplash.com/photo-1520182205149-1e5e4e7329b4?q=80&w=150' },
  { id: '15', name: 'ارتباك', imageUrl: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=150' },
  { id: '16', name: 'وحدة', imageUrl: 'https://images.unsplash.com/photo-1518384405706-40157963cc9b?q=80&w=150' },
  { id: '17', name: 'دهشة', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=150' },
  { id: '18', name: 'قلق', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=150' },
  { id: '19', name: 'رضا', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=150' },
  { id: '20', name: 'تعب', imageUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=150' },
  { id: '21', name: 'عجز', imageUrl: 'https://images.unsplash.com/photo-1502641470433-28956903d3c8?q=80&w=150' },
  { id: '22', name: 'أمل', imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=150' },
  { id: '23', name: 'ندم', imageUrl: 'https://images.unsplash.com/photo-1454486844807-c812766e8446?q=80&w=150' },
  { id: '24', name: 'فضول', imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=150' }
];

export const TOOL_BANKS: ToolBank[] = [
  {
    title: 'التنظيم العاطفي (نموذج أفرات، اليقظة الذهنية)',
    tools: ['التنفس العميق', 'نموذج أفرات (EFRAT)', 'الحديث الذاتي المشجع', 'اليقظة الذهنية (Mindfulness)', 'تقنيات التثبيت (5-4-3-2-1)']
  },
  {
    title: 'تنظيم الوقت (بومودورو، آيزنهاور)',
    tools: ['تقنية بومودورو', 'مصفوفة آيزنهاور', 'الجدول الزمني الرقمي', 'تجزئة المهام (Chunking)', 'تحديد الأولويات']
  },
  {
    title: 'الأهداف والقيم',
    tools: ['تحديد أهداف SMART', 'الاتصال بالقيم الجوهرية', 'تحليل الربح والخسارة', 'تخيل النجاح', 'وضع الحدود']
  },
  {
    title: 'التخطيط، المراقبة والتقييم',
    tools: ['ورقة متابعة الأداء', 'التأمل اليومي', 'استراتيجية التغذية الذاتية', 'طلب التغذية الراجعة', 'استخلاص الدروس']
  }
];

export const INITIAL_THOUGHT_PAIRS: ThoughtPair[] = [
  { original: 'أنا أفشل دائماً في كل شيء', alternative: 'هذه المهمة تحديداً صعبة حالياً، لكنني نجحت في الماضي' },
  { original: 'الجميع هنا أذكى مني', alternative: 'لكل شخص وتيرة تعلم مختلفة، أنا أركز على تقدمي الخاص' },
  { original: 'لا فرصة لدي لتجاوز هذا', alternative: 'إذا قمت بتفكيك المهمة لخطوات صغيرة، سأتمكن من التقدم' },
  { original: 'دائماً ما يفسد كل شيء في النهاية', alternative: 'لدي سيطرة على أفعالي ويمكنني التصحيح أثناء العمل' },
  { original: 'هم يفعلون ذلك بي عمداً', alternative: 'قد يكون لديهم صعوباتهم الخاصة التي لا تتعلق بي' },
  { original: 'يجب أن أكون مثالياً لأنجح', alternative: 'الأخطاء جزء من التعلم وهي لا تحدد قيمتي الشخصية' },
  { original: 'ليس لدي القوة للتعامل مع هذا', alternative: 'يمكنني أخذ استراحة قصيرة ثم المحاولة مجدداً بأسلوب آخر' },
  { original: 'سينتهي هذا بالتأكيد بكارثة', alternative: 'أنا أركز على الحقائق المتوفرة الآن وليس على التوقعات السلبية' },
  { original: 'لا يمكنني التحكم في مشاعري', alternative: 'الشعور قوي حالياً، لكنني أختار كيفية الاستجابة له' },
  { original: 'مستقبلي يبدو مظلماً', alternative: 'حالياً يصعب علي رؤية الضوء، لكن الأمور يمكن أن تتغير' }
];
