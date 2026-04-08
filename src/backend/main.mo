import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Topic = {
    id : Nat;
    title : Text;
    category : Text;
    content : Text;
    subtopics : [Text];
  };

  module Topic {
    public func compare(topic1 : Topic, topic2 : Topic) : Order.Order {
      Nat.compare(topic1.id, topic2.id);
    };
  };

  public type TopicInput = {
    title : Text;
    category : Text;
    content : Text;
    subtopics : [Text];
  };

  let topicStore = Map.empty<Nat, Topic>();
  var nextTopicId = 1;
  let categoriesList = List.empty<Text>();
  let adminPrincipal = Principal.fromText("2vxsx-fae");

  func authorizeAdmin(caller : Principal) {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized. Only admin can perform this action.");
    };
  };

  public shared ({ caller }) func addTopic(topic : TopicInput) : async Nat {
    authorizeAdmin caller;
    let id = nextTopicId;
    nextTopicId += 1;

    let newTopic : Topic = {
      id;
      title = topic.title;
      category = topic.category;
      content = topic.content;
      subtopics = topic.subtopics;
    };

    topicStore.add(id, newTopic);

    if (not categoriesList.toArray().any(func(c) { c == topic.category })) {
      categoriesList.add(topic.category);
    };

    id;
  };

  public shared ({ caller }) func updateTopic(id : Nat, updatedTopic : TopicInput) : async () {
    authorizeAdmin caller;
    if (not topicStore.containsKey(id)) {
      Runtime.trap("Topic not found");
    };
    let topic : Topic = {
      id;
      title = updatedTopic.title;
      category = updatedTopic.category;
      content = updatedTopic.content;
      subtopics = updatedTopic.subtopics;
    };
    topicStore.add(id, topic);
  };

  public shared ({ caller }) func deleteTopic(id : Nat) : async () {
    authorizeAdmin caller;
    if (not topicStore.containsKey(id)) {
      Runtime.trap("Topic not found");
    };
    topicStore.remove(id);
  };

  public query func getTopic(id : Nat) : async Topic {
    switch (topicStore.get(id)) {
      case (null) { Runtime.trap("Topic not found") };
      case (?topic) { topic };
    };
  };

  public query func getTopicsByCategory(category : Text) : async [Topic] {
    topicStore.values().toArray().filter(func(t) { t.category == category }).sort();
  };

  public query func getAllCategories() : async [Text] {
    categoriesList.toArray().sort();
  };

  public query func getAllTopics() : async [Topic] {
    topicStore.values().toArray().sort();
  };

  public shared ({ caller }) func seedSampleData() : async () {
    authorizeAdmin caller;

    let sampleTopics : [TopicInput] = [
      {
        title = "मराठी व्याकरण - नामाचे प्रकार";
        category = "मराठी व्याकरण";
        content = "नाम म्हणजे व्यक्ती, स्थळ किंवा वस्तुचे नाव. उदा. राम, पुणे, पुस्तक.";
        subtopics = ["नाम", "संज्ञा", "विशेषणे"];
      },
      {
        title = "भारतीय इतिहास - मौर्य साम्राज्य";
        category = "भारतीय इतिहास";
        content = "मौर्य साम्राज्याची स्थापना चंद्रगुप्त मौर्य यांनी केली. अशोक हा महान राजा होता.";
        subtopics = ["चंद्रगुप्त मौर्य", "अशोक", "राज्यव्यवस्था"];
      },
      {
        title = "महाराष्ट्रातील नद्या";
        category = "महाराष्ट्र भूगोल";
        content = "गोदावरी, भागीरथी, पंढरी, कृष्णा या महाराष्ट्रातील प्रमुख नद्या आहेत.";
        subtopics = ["गोदावरी", "कृष्णा", "नदी प्रणाली"];
      },
      {
        title = "भारतीय संविधान - मूलभूत अधिकार";
        category = "भारतीय संविधान";
        content = "भारतीय नागरिकांना मूलभूत अधिकार दिले आहेत - समानता, स्वातंत्र्य, शिक्षा व संरक्षण.";
        subtopics = ["समानता", "स्वातंत्र्य", "संरक्षण"];
      },
      {
        title = "सामान्य विज्ञान - मानव श्वासोच्छवास";
        category = "सामान्य विज्ञान";
        content = "श्वासोच्छवास प्रक्रिया म्हणजे ऑक्सिजन घेणे व कार्बन डायऑक्साइड बाहेर टाकणे.";
        subtopics = ["श्वासोच्छवास", "फुफ्फुसे", "शरीर शास्त्र"];
      },
      {
        title = "गणित - घातांक व वर्गमूळ";
        category = "गणित";
        content = "गणितातील घातांक म्हणजे एकाच संख्येचे वारंवार गुणन. वर्गमूळ म्हणजे दिलेल्या संख्येचा वर्ग काढणे.";
        subtopics = ["घातांक", "वर्गमूळ", "गणिती संज्ञा"];
      },
      {
        title = "चालू घडामोडी - 2023";
        category = "चालू घडामोडी";
        content = "2023 मध्ये भारताने G20 बैठकीचे अध्यक्षपद भूषवले.";
        subtopics = ["G20", "भारत", "आंतरराष्ट्रीय घडामोडी"];
      },
      {
        title = "पोलीस कायदे - IPC 302";
        category = "पोलीस कायदे";
        content = "IPC 302 हा हत्या केल्यास दिला जाणारा गुन्हा आहे. शिक्षा - आजन्म कारावास किंवा मृत्युदंड.";
        subtopics = ["IPC", "गुन्हे शाखा", "कायदा"];
      },
      {
        title = "मराठी व्याकरण - क्रियापदे";
        category = "मराठी व्याकरण";
        content = "क्रियापद म्हणजे कृती सूचित करणारे शब्द. उदा. जाऊ, खा, बोल. ";
        subtopics = ["क्रियापद", "क्रियाशब्द", "वाक्यरचना"];
      },
      {
        title = "गणित - घनफळ व क्षेत्रफळ";
        category = "गणित";
        content = "घनफळ म्हणजे त्रिमितीय आकाराचा सामूहिक परिणाम. क्षेत्रफळ म्हणजे दोन परिमितीचा भाग मोजण्याची प्रक्रिया. ";
        subtopics = ["घनफळ", "क्षेत्रफळ", "मोजमाप"];
      },
    ];

    for (topic in sampleTopics.values()) {
      ignore addTopic(topic);
    };

    Runtime.trap("Sample data seeded successfully");
  };
};
