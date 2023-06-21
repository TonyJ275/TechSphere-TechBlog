require('../models/database');
const Category = require('../models/Category');
const Article = require('../models/Article');


/* 
  GET/
  Homepage
*/

exports.homepage = async (req, res) => {

  try {
    const categoryLimit = 3;
    const articleLimit = 5;

    const categories = await Category.find({}).limit(categoryLimit);
    const latest = await Article.find({}).sort({_id: -1}).limit(articleLimit);
    const allCategories = await Category.find({});

    let categoryWiseArticles = [];

    try {
      for (let i = 0; i < allCategories.length; i++) {
        const categoryArticles = await Article.find({ 'category': allCategories[i].name }).sort({_id: -1}).limit(articleLimit);
        categoryWiseArticles.push(categoryArticles);
      }
    } catch (error) {
      console.log(error);
    }

    // const ai = await Article.find({ 'category': 'Artificial Intelligence' }).limit(articleLimit);
    // const cybersecurity = await Article.find({ 'category': 'Cybersecurity' }).limit(articleLimit);
    // const iot = await Article.find({ 'category': 'Internet of Things (IoT)' }).limit(articleLimit);
    // const laptop = await Article.find({ 'category': 'Laptops & Notebooks' }).limit(articleLimit);
    // const mobile = await Article.find({ 'category': 'Smartphones & Mobile Devices' }).limit(articleLimit);
    // const tech = await Article.find({ 'category': 'Emerging Technologies' }).limit(articleLimit);
    // categoryWiseArticles = [ai, cybersecurity, iot, laptop, mobile, tech];

    res.render('index', { title: "TechSphere-Home", categories, latest, categoryWiseArticles });
  }
  catch (error) {

    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


/* 
  GET/categories
  Categories
*/

exports.exploreCategories = async (req, res) => {

  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render('categories', { title: "TechSphere-Categories", categories });
  }
  catch (error) {

    res.status(500).send({ message: error.message || "Error Occured" });
  }

}


/* 
  GET/articles/:id
  articles
*/

exports.exploreArticles = async (req, res) => {

  try {
    let articleId = req.params.id;
    const article = await Article.findById(articleId);

    // console.log(article.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    res.render('article', { title: "TechSphere-Articles", article });
  }
  catch (error) {
    const article = null;
    res.render('article', { title: "TechSphere-Articles", article });
    console.error({message: error.message});
    // res.status(500).send({ message: error.message || "Error Occured" });
  }

}


/* 
  GET/categories/:id
  categories by Id
*/

exports.exploreCategoryArticlesById = async (req, res) => {

  try {
    // console.log(req.params);
    let categoryNameId = req.params.id;
    const categoryArticlesById = await Article.find({ 'category': categoryNameId }).sort({_id: -1});

    res.render('categoryById', { title: "TechSphere-Categories", categoryArticlesById });
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
  
}



/* 
  POST /search
  Search
*/

exports.searchArticle = async (req, res) => {

  try {
    let searchTerm = req.body.searchTerm;
    const searchArticles = await Article.find( { $text: { $search: searchTerm, $diacriticSensitive: true } }).sort({_id: -1});
    
    res.render('search', { title: "TechSphere-Search", searchArticles });
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
  
}


/* 
  GET /explore-latest
  Latest
*/

exports.exploreLatest = async (req, res) => {

  try {
    const articleLimit = 20;
    const latest = await Article.find({}).sort({_id: -1}).limit(articleLimit);
    
    res.render('explore-latest', { title: "TechSphere-Latest Articles", latest });
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
  
}


/* 
  GET /add-article
  add an Article
*/

exports.addArticle = async (req, res) => {

  try {
    const articleLimit = 20;
    const latest = await Article.find({}).sort({_id: -1}).limit(articleLimit);

    const infoErrorObj = req.flash('infoError');
    const infoSubmitObj = req.flash('infoSubmit');
    
    res.render('add-article', { title: "TechSphere-Latest Articles", latest, infoErrorObj, infoSubmitObj });
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
  
}


/* 
  POST /add-article
  Submit Article
*/

exports.submitArticle = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } 
    else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })
    }

    const newArticle = new Article({
      name: req.body.name,
      category: req.body.category,
      image: newImageName,
      description: req.body.description,
      email: req.body.email,
    });

    // console.log( req.body.name, req.body.category, req.body.description, req.body.email);

    await newArticle.save();

    req.flash('infoSubmit', 'Article has been added!');
    res.redirect('/add-article');
  }
  catch (error) {
    req.flash('infoError', error);
    res.redirect('/add-article');
  }
}


/* 
  GET /about
  About Us
*/

exports.aboutUs = async (req, res) => {

  try {
    res.render('about', { title: "TechSphere-About Us"});
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
  
}

/* 
  GET /contact
  Contact Us
*/

exports.contact = async (req, res) => {

  try {
    res.render('contact', { title: "TechSphere-Contact Us"});
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
  
}


// async function updateArticle(){
//   try {
//     const res = await Article.updateOne({ name: 'Exploring the RTX 40 Series' }, { name: 'The Future of  AI' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateArticle();













// async function insertDummyCateforyData(){
//     try {
//         await Category.insertMany([
//             {
//                 'name': "The Rise of Artificial Intelligence: A Prime",
//                 'image': "/images/ai.jpg"
//             },
//             {
//                 'name': "Cybersecurity Best Practices: Protecting Your Data in a Digital World",
//                 'image': "/images/cybersecurity.png"
//             },
//             {
//                 'name': "How to maximize battery life",
//                 'image': "/images/battery.jpg"
//             },
//             {
//                 'name': "5G Technology: Unlocking the Potential ",
//                 'image': "/images/5G.jpg "
//             },
//         ]);
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

  
// async function insertDummyData() {
//   try {
//     await Article.insertMany([
//       {
//         name: "The Future of AI",
//         image: "ai.jpg",
//         description: `Introduction:
//             Artificial Intelligence (AI) has rapidly evolved over the years, moving from science fiction to practical applications that shape our daily lives. As we stand at the threshold of a new era, it's crucial to explore the potential and impact of AI on the future. This article delves into the transformative power of AI, its implications across various industries, and the ways it empowers humanity to achieve new heights of innovation.
            
//             Unleashing Intelligent Automation:
//             AI is revolutionizing industries by enabling intelligent automation. With advancements in machine learning, deep learning, and natural language processing, AI systems can process vast amounts of data, learn from patterns, and make intelligent decisions. This enables automation of repetitive tasks, freeing up human resources for more complex and creative endeavors.
            
//             Enhancing Healthcare:
//             AI is poised to revolutionize healthcare, leading to improved diagnostics, personalized treatments, and efficient patient care. Machine learning algorithms can analyze medical records, genomic data, and clinical research to provide accurate diagnoses and suggest optimal treatment plans. AI-powered devices and wearables can monitor patient health, providing real-time insights and enabling early interventions.
            
//             Transforming Transportation:
//             The future of transportation will be shaped by AI-driven technologies. Self-driving cars, powered by AI algorithms and sensors, promise enhanced safety and reduced traffic congestion. AI can optimize logistics and supply chain management, making transportation more efficient and sustainable. Furthermore, AI-powered traffic management systems can dynamically adapt to changing conditions, reducing commute times and improving overall transportation infrastructure.
            
//             Revolutionizing Manufacturing and Robotics:
//             AI-powered robotics is transforming the manufacturing industry. Intelligent robots can perform intricate tasks with precision and adapt to changing requirements. Machine learning algorithms enable predictive maintenance, reducing downtime and maximizing productivity. Collaborative robots, working alongside humans, enhance efficiency and safety in manufacturing processes.
            
//             Empowering Education:
//             AI has the potential to revolutionize education, providing personalized learning experiences tailored to individual students. Intelligent tutoring systems can adapt to students' learning styles and pace, facilitating better comprehension and engagement. AI-powered tools can automate administrative tasks, allowing educators to focus on creating immersive learning environments and fostering critical thinking skills.
            
//             Addressing Climate Change:
//             The future of AI is closely intertwined with addressing the pressing issue of climate change. AI can assist in optimizing energy consumption, managing renewable resources effectively, and predicting environmental risks. Machine learning algorithms can analyze vast datasets to identify patterns and develop sustainable solutions, helping us transition to a greener future.
            
//             Ethical Considerations:
//             As AI becomes more integrated into our lives, ethical considerations become paramount. Transparency, fairness, and accountability are crucial in developing and deploying AI systems. Ensuring unbiased algorithms, protecting privacy, and addressing potential job displacement are important aspects of AI governance.
            
//             Conclusion:
//             The future of AI holds immense promise, with transformative potential across industries and the ability to empower humanity. Embracing AI responsibly, with a focus on ethical considerations, can unlock a future where intelligent systems augment human capabilities, enable new discoveries, and pave the way for unprecedented advancements. As we embark on this journey, it's essential to leverage the power of AI for the betterment of society and to shape a future where AI acts as a catalyst for positive change.`,
//         category: "Artificial Intelligence",
//         email: "example1@email.com"
//       },
//       {
//         name: "How to Maximize Battery Life",
//         image: "battery.jpg",
//         description: "Discover effective strategies to prolong battery life on your devices and make the most out of each charge.",
//         category: "Smartphones & Mobile Devices",
//         email: "example2@email.com"
//       },
//       {
//         name: "Cybersecurity Best Practices: Protecting Your Data in a Digital World",
//         image: "cybersecurity.jpg",
//         description: "Explore essential cybersecurity best practices to safeguard your sensitive data and stay protected in an increasingly digital landscape.",
//         category: "Cybersecurity",
//         email: "example3@email.com"
//       },
//       {
//         name: "5G Technology: Unlocking the Potential",
//         image: "5G.jpg",
//         description: "Discover the transformative power of 5G technology and its potential to revolutionize communication, connectivity, and various industries.",
//         category: "Internet of Things (IoT)",
//         email: "example4@email.com"
//       },
//     ]);
//   }
//   catch (error) {
//     console.log(error);
//   }
// }

// insertDummyData();