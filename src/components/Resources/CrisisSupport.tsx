import React from 'react';
import { Phone, ExternalLink, Clock, AlertTriangle, Heart, Shield, MapPin } from 'lucide-react';
import { crisisResources } from '../../data/crisisResources';
import Card from '../UI/Card';
import Button from '../UI/Button';

const CrisisSupport: React.FC = () => {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crisis Support Resources</h1>
          <h2 className="text-xl text-gray-700 mb-2">संकट सहायता संसाधन</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            If you're experiencing a mental health crisis, you're not alone. These Indian resources provide 
            immediate support from trained professionals who understand our cultural context and care about your wellbeing.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            यदि आप मानसिक स्वास्थ्य संकट का सामना कर रहे हैं, तो आप अकेले नहीं हैं। ये भारतीय संसाधन प्रशिक्षित पेशेवरों से तत्काल सहायता प्रदान करते हैं।
          </p>
        </div>

        {/* Emergency Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Immediate Emergency / तत्काल आपातकाल</h3>
              <p className="text-red-800 mb-3">
                If you're in immediate danger or having thoughts of suicide, please call 100 (Police) or go to your nearest emergency room.
                यदि आप तत्काल खतरे में हैं या आत्महत्या के विचार आ रहे हैं, तो कृपया 100 (पुलिस) पर कॉल करें या अपने निकटतम आपातकालीन कक्ष में जाएं।
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleCall('100')}
                >
                  Call 100 (Police)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCall('1800-599-0019')}
                >
                  Kiran Helpline: 1800-599-0019
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* National Helplines */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">National 24/7 Support Services</h2>
          <h3 className="text-lg text-gray-700 mb-6">राष्ट्रीय 24/7 सहायता सेवाएं</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {crisisResources.slice(0, 4).map((resource) => (
              <Card key={resource.id} hover className="border-l-4 border-l-primary-500">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">{resource.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.availability}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Phone}
                      onClick={() => handleCall(resource.phone)}
                    >
                      {resource.phone}
                    </Button>
                    
                    {resource.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={ExternalLink}
                        onClick={() => handleWebsite(resource.url!)}
                      >
                        Website
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* City-wise Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">City-wise Support Centers</h2>
          <h3 className="text-lg text-gray-700 mb-6">शहरवार सहायता केंद्र</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crisisResources.slice(4).map((resource) => (
              <Card key={resource.id} hover>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3">{resource.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Phone}
                      onClick={() => handleCall(resource.phone)}
                    >
                      {resource.phone}
                    </Button>
                    <span className="text-xs text-gray-500">{resource.availability}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Self-Care Tips */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Immediate Self-Care Strategies</h2>
          <h3 className="text-lg text-gray-700 mb-6">तत्काल स्व-देखभाल रणनीतियां</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Breathing Exercise / सांस की तकनीक</h3>
                <p className="text-gray-600 text-sm">
                  4 गिनती में सांस लें, 4 तक रोकें, 4 में छोड़ें। जब तक शांत न हों तब तक दोहराएं।
                  Breathe in for 4 counts, hold for 4, exhale for 4. Repeat until you feel calmer.
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Grounding Technique / ग्राउंडिंग तकनीक</h3>
                <p className="text-gray-600 text-sm">
                  5 चीजें जो दिखती हैं, 4 जो छू सकते हैं, 3 जो सुनाई देती हैं, 2 जो सूंघ सकते हैं, 1 जो चख सकते हैं।
                  Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reach Out / संपर्क करें</h3>
                <p className="text-gray-600 text-sm">
                  किसी विश्वसनीय मित्र, परिवारजन, या ऊपर दिए गए संकट संसाधनों से संपर्क करें।
                  Contact a trusted friend, family member, or any of the crisis resources above.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Cultural Considerations */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding Indian Mental Health Context</h3>
          <h4 className="text-md font-medium text-gray-800 mb-3">भारतीय मानसिक स्वास्थ्य संदर्भ को समझना</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Family Dynamics:</strong> Many helplines understand the complexity of Indian family structures and can provide culturally sensitive guidance.</p>
            <p><strong>पारिवारिक गतिशीलता:</strong> कई हेल्पलाइनें भारतीय पारिवारिक संरचनाओं की जटिलता को समझती हैं और सांस्कृतिक रूप से संवेदनशील मार्गदर्शन प्रदान कर सकती हैं।</p>
            <p><strong>Language Support:</strong> Most national helplines offer support in multiple Indian languages including Hindi, Tamil, Telugu, Bengali, and more.</p>
            <p><strong>भाषा सहायता:</strong> अधिकांश राष्ट्रीय हेल्पलाइनें हिंदी, तमिल, तेलुगु, बंगाली और अन्य भारतीय भाषाओं में सहायता प्रदान करती हैं।</p>
          </div>
        </Card>

        {/* Safety Planning */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Creating a Safety Plan / सुरक्षा योजना बनाना</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>1. Warning Signs / चेतावनी के संकेत:</strong> उन विचारों, भावनाओं या स्थितियों की पहचान करें जो संकट का कारण बन सकती हैं।</p>
            <p><strong>2. Coping Strategies / मुकाबला रणनीतियां:</strong> उन गतिविधियों की सूची बनाएं जो परेशान होने पर बेहतर महसूस करने में मदद करती हैं।</p>
            <p><strong>3. Support Network / सहायता नेटवर्क:</strong> उन लोगों के नाम लिखें जिनसे आप अभिभूत महसूस करने पर बात कर सकते हैं।</p>
            <p><strong>4. Professional Contacts / पेशेवर संपर्क:</strong> अपने चिकित्सक, डॉक्टर और संकट हेल्पलाइन नंबरों को सुलभ रखें।</p>
            <p><strong>5. Safe Environment / सुरक्षित वातावरण:</strong> संकट के दौरान हानिकारक हो सकने वाली वस्तुओं को हटाएं या सुरक्षित करें।</p>
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            This app is not a substitute for professional mental health care. If you're experiencing a crisis, 
            please contact emergency services or a mental health professional immediately.
          </p>
          <p className="mt-1">
            यह ऐप पेशेवर मानसिक स्वास्थ्य देखभाल का विकल्प नहीं है। यदि आप संकट का सामना कर रहे हैं, 
            तो कृपया तुरंत आपातकालीन सेवाओं या मानसिक स्वास्थ्य पेशेवर से संपर्क करें।
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;