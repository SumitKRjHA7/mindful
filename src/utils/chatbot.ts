import { ChatMessage } from '../types';

interface BotResponse {
  message: string;
  followUp?: string;
  resources?: string[];
  type?: 'supportive' | 'crisis' | 'reflection' | 'celebration';
}

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'don\'t want to live', 'hurt myself',
  'self harm', 'cutting', 'dying', 'hopeless', 'no point', 'give up',
  'मरना चाहता हूं', 'आत्महत्या', 'जीना नहीं चाहता', 'खुद को नुकसान',
  'చావాలని అనిపిస్తుంది', 'आपघात', 'मृत्यू', 'தற்கொலை', 'മരിക്കാൻ ആഗ്രഹിക്കുന്നു'
];

const POSITIVE_KEYWORDS = [
  'happy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'awesome',
  'accomplished', 'proud', 'grateful', 'blessed', 'thankful', 'joy', 'love',
  'खुश', 'प्रसन्न', 'आनंदित', 'गर्व', 'कृतज्ञ', 'धन्यवाद', 'खुशी', 'प्रेम',
  'సంతోషం', 'గర్వం', 'కృతజ్ఞత', 'खूप आनंद', 'खूप छान', 'மகிழ்ச்சி', 'गुरुर', 'സന്തോഷം'
];

const ANXIETY_KEYWORDS = [
  'anxious', 'worried', 'panic', 'scared', 'nervous', 'overwhelmed', 'stress',
  'fear', 'racing thoughts', 'can\'t breathe', 'heart racing', 'dizzy',
  'चिंता', 'घबराहट', 'डर', 'तनाव', 'परेशान', 'व्याकुल', 'भयभीत',
  'ఆందోళన', 'భయం', 'టెన్షన', 'चिंता', 'भीती', 'கவலை', 'பயம்', 'ഉത്കണ്ഠ', 'ഭയം'
];

const DEPRESSION_KEYWORDS = [
  'depressed', 'sad', 'down', 'empty', 'numb', 'tired', 'exhausted', 'lonely',
  'worthless', 'failed', 'disappointed', 'lost', 'dark', 'heavy',
  'उदास', 'दुखी', 'अकेला', 'निराश', 'हताश', 'थका हुआ', 'खाली',
  'దిగులు', 'దుఃఖం', 'ఒంటరితనం', 'निराशा', 'दुःख', 'வருத्तम्', 'தனிமை', 'ദുഃഖം', 'ഏകാന്തത'
];

const FAMILY_PRESSURE_KEYWORDS = [
  'family pressure', 'arranged marriage', 'career pressure', 'parents expectations',
  'society pressure', 'relatives', 'comparison', 'family honor', 'izzat',
  'पारिवारिक दबाव', 'माता-पिता का दबाव', 'समाज का दबाव', 'रिश्तेदार', 'इज्जत',
  'కుటుంబ ఒత్తిడి', 'తల్లిదండ్రుల అంచనలు', 'సమాజ ఒత్తిడి', 'कुटुंब दबाव', 'पालकांचे अपेक्षा'
];

const SUPPORTIVE_RESPONSES = [
  "मैं आपकी बात सुन रहा हूं, और मैं चाहता हूं कि आप जानें कि आपकी भावनाएं वैध हैं। ऐसा महसूस करना ठीक है।",
  "आपने मेरे साथ साझा करने के लिए धन्यवाद। अपनी भावनाओं को व्यक्त करने के लिए साहस की आवश्यकता होती है।",
  "I hear you, and I want you to know that your feelings are valid. It's okay to feel this way.",
  "Thank you for sharing with me. It takes courage to express how you're feeling.",
  "मैं यहां आपकी बात सुनने और इस यात्रा में आपका साथ देने के लिए हूं। आप इसमें अकेले नहीं हैं।",
  "I'm here to listen and support you through this. You're not alone in this journey.",
  "आपकी भावनाएं मायने रखती हैं, और आप भी मायने रखते हैं। आइए इसे एक साथ हल करते हैं।",
  "Your feelings matter, and so do you. Let's work through this together."
];

const CRISIS_RESPONSES = [
  "मुझे आपकी बात से बहुत चिंता हो रही है। आपका जीवन मूल्यवान और अर्थपूर्ण है। कृपया तुरंत किसी क्राइसिस हेल्पलाइन से संपर्क करें - वहां प्रशिक्षित पेशेवर हैं जो अभी आपकी मदद कर सकते हैं।",
  "I'm very concerned about what you're sharing. Your life has value and meaning. Please reach out to Kiran Mental Health Helpline at 1800-599-0019 immediately.",
  "आप जो महसूस कर रहे हैं वह अस्थायी है, भले ही ऐसा न लगे। कृपया तुरंत किसी मानसिक स्वास्थ्य पेशेवर या क्राइसिस सेवा से संपर्क करें।",
  "What you're feeling is temporary, even though it might not feel that way. Please contact a mental health professional or crisis service immediately for support."
];

const REFLECTION_PROMPTS = [
  "आज आपको आराम देने वाली एक छोटी सी बात क्या है?",
  "What's one small thing that brought you comfort today?",
  "क्या आप किसी ऐसे समय के बारे में सोच सकते हैं जब आपने इसी तरह की चुनौती पर काबू पाया था?",
  "Can you think of a time when you overcame a similar challenge?",
  "यदि कोई मित्र आपकी तरह महसूस कर रहा हो तो आप उसे क्या कहेंगे?",
  "What would you tell a friend who was feeling the same way?",
  "अभी आप तीन चीजों के लिए आभारी हैं, भले ही वे छोटी हों?",
  "What are three things you're grateful for right now, even if they're small?",
  "आप अपने साथ वैसी ही दयालुता कैसे दिखा सकते हैं जैसी आप एक अच्छे मित्र के साथ दिखाते हैं?",
  "How might you show yourself the same kindness you'd show a good friend?"
];

const CULTURAL_RESPONSES = [
  "मैं समझता हूं कि भारतीय समाज में पारिवारिक और सामाजिक दबाव कितना कठिन हो सकता है। आपकी भावनाएं वैध हैं।",
  "I understand how challenging family and societal pressures can be in Indian society. Your feelings are valid.",
  "कभी-कभी हमारे सपने और परिवार की अपेक्षाओं के बीच संतुलन बनाना मुश्किल होता है। यह संघर्ष सामान्य है।",
  "Sometimes it's difficult to balance our dreams with family expectations. This struggle is normal.",
  "आपकी खुशी और मानसिक स्वास्थ्य उतना ही महत्वपूर्ण है जितना कि दूसरों की अपेक्षाएं।",
  "Your happiness and mental health are just as important as others' expectations."
];

export class MindfulChatbot {
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private detectCrisis(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  }

  private detectFamilyPressure(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return FAMILY_PRESSURE_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  }

  private detectEmotion(message: string): 'positive' | 'anxiety' | 'depression' | 'family_pressure' | 'neutral' {
    const lowerMessage = message.toLowerCase();
    
    if (this.detectFamilyPressure(message)) {
      return 'family_pressure';
    }
    if (POSITIVE_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'positive';
    }
    if (ANXIETY_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'anxiety';
    }
    if (DEPRESSION_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'depression';
    }
    return 'neutral';
  }

  generateResponse(userMessage: string, conversationHistory: ChatMessage[]): BotResponse {
    const isCrisis = this.detectCrisis(userMessage);
    
    if (isCrisis) {
      return {
        message: this.getRandomResponse(CRISIS_RESPONSES),
        type: 'crisis',
        resources: [
          'Kiran Mental Health Helpline: 1800-599-0019',
          'Vandrevala Foundation: 9999-666-555',
          'Aasra Mumbai: 022-2754-6669'
        ]
      };
    }

    const emotion = this.detectEmotion(userMessage);
    let response: BotResponse;

    switch (emotion) {
      case 'family_pressure':
        response = {
          message: `${this.getRandomResponse(CULTURAL_RESPONSES)} ${this.getRandomResponse([
            "परिवार से बात करना कभी-कभी मुश्किल होता है, लेकिन आपकी भावनाओं को व्यक्त करना महत्वपूर्ण है।",
            "It's important to find a balance between respecting family values and taking care of your own wellbeing.",
            "आपके सपने और लक्ष्य भी उतने ही महत्वपूर्ण हैं। धीरे-धीरे अपनी बात रखने की कोशिश करें।"
          ])}`,
          type: 'supportive',
          followUp: "क्या आप इस स्थिति में किसी विश्वसनीय व्यक्ति से बात कर सकते हैं? / Can you talk to someone you trust about this situation?"
        };
        break;

      case 'positive':
        response = {
          message: `यह सुनकर बहुत अच्छा लगा! मैं खुश हूं कि आप सकारात्मक भावनाओं का अनुभव कर रहे हैं। ${this.getRandomResponse([
            "इन पलों का जश्न मनाना महत्वपूर्ण है।",
            "These feelings are just as valid and important to acknowledge.",
            "मुझे और जानना अच्छा लगेगा कि आपको खुशी क्या दे रही है।"
          ])}`,
          type: 'celebration',
          followUp: "इन सकारात्मक भावनाओं में सबसे ज्यादा योगदान किस बात का है? / What's contributing most to these positive feelings?"
        };
        break;

      case 'anxiety':
        response = {
          message: `मैं समझता हूं कि आप अभी चिंतित महसूस कर रहे हैं। ${this.getRandomResponse(SUPPORTIVE_RESPONSES)} जब हम चिंतित होते हैं, तो सांस लेने और ग्राउंडिंग तकनीकों पर ध्यान देना मददगार हो सकता है।`,
          type: 'supportive',
          followUp: "क्या आप मेरे साथ एक सरल सांस लेने का अभ्यास करना चाहेंगे? / Would you like to try a simple breathing exercise together?"
        };
        break;

      case 'depression':
        response = {
          message: `मैं समझता हूं कि आप एक कठिन समय से गुजर रहे हैं। ${this.getRandomResponse(SUPPORTIVE_RESPONSES)} अवसाद भारी लग सकता है, लेकिन मदद मांगकर आपने एक महत्वपूर्ण कदम उठाया है।`,
          type: 'supportive',
          followUp: this.getRandomResponse(REFLECTION_PROMPTS)
        };
        break;

      default:
        response = {
          message: `${this.getRandomResponse(SUPPORTIVE_RESPONSES)} मैं यहां आपकी बात सुनने और आपका साथ देने के लिए हूं।`,
          type: 'supportive',
          followUp: "आप अभी कैसा महसूस कर रहे हैं? मैं आपके मन की बात को और समझना चाहूंगा। / How are you feeling right now? I'd like to understand more about what's on your mind."
        };
    }

    return response;
  }

  getDailyPrompt(): string {
    const prompts = [
      "आज आप किस बात के लिए आभारी हैं? / What's one thing you're grateful for today?",
      "आज आपने अपने या दूसरों के साथ कैसे दयालुता दिखाई? / How did you show kindness to yourself or others today?",
      "आज आपको किस चीज़ ने चुनौती दी, और आपने इसे कैसे संभाला? / What challenged you today, and how did you handle it?",
      "आज की एक छोटी जीत जिसका आप जश्न मना सकते हैं? / What's one small victory you can celebrate from today?",
      "आप अभी कैसा महसूस कर रहे हैं, और आपको क्या चाहिए? / How are you feeling right now, and what do you need?",
      "हाल ही में किस बात ने आपको मुस्कुराने पर मजबूर किया? / What's something that made you smile recently?",
      "आज की किस बात को आप छोड़ना चाहेंगे? / What would you like to let go of from today?",
      "कल आप अपने साथ कैसे नरम हो सकते हैं? / How can you be gentle with yourself tomorrow?",
      "आज आपने अपने बारे में क्या सीखा? / What's one thing you learned about yourself today?",
      "आप किस बात का इंतज़ार कर रहे हैं? / What are you looking forward to?"
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
}

export const chatbot = new MindfulChatbot();