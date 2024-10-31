----------------------------------------------------------------------------------------
--------------------------------------- FAQ -------------------------------------------
----------------------------------------------------------------------------------------

-- Inserting Article Categories
INSERT INTO ArticleCategory (Name) VALUES
('Nutrition'),
('Exercise'),
('Mental Health'),
('Booking'),
('Scheduling'),
('Community'),
('Wellness Hub'),
('Feedback');

-- Inserting Articles
INSERT INTO Article (ArticleCategory_ID, Title, Description, DateCreated, DateUpdated) VALUES
(1, 'Balancing Your Diet', 'Learn how to maintain a balanced diet that suits your fitness goals.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Understanding Macronutrients', 'Dive into the roles of proteins, fats, and carbohydrates in your diet and how to balance them.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Effective Cardio Workouts', 'Explore the best cardio workouts for improving endurance and losing weight.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Strength Training Basics', 'A beginner’s guide to strength training: understanding basic exercises and safety tips.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Benefits of Regular Physical Activity on Mental Health', 'Explore how regular physical activity can enhance your mental well-being and reduce symptoms of depression and anxiety.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Managing Stress with Meditation', 'Discover techniques to manage stress through daily meditation.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'How to Book Your Session', 'Steps to book a session with a psychologist or a physician.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Understanding Your Health Professionals', 'Get to know the qualifications and specialties of our health professionals to choose the best fit for your needs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Managing Your Schedule', 'Tips on how to effectively manage your workout, meal, and booking schedules.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Optimizing Your Daily Routine', 'Strategies to integrate your fitness and health activities seamlessly into your everyday life.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Getting Involved in the Community', 'How to engage with the community forums and connect with other users.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Enhancing Community Engagement', 'Tips on how to be more active and visible within the community, encouraging discussions and collaborations.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Exploring the Wellness Hub', 'Learn about the courses and meditation practices available in the Wellness Hub.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Yoga for Beginners', 'Introduction to yoga: understanding the basics, benefits, and different styles for starters.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'How to Provide Feedback', 'Guide on how to give feedback and rate our app to help us improve.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Improving User Experience', 'How your feedback helps us to continuously improve the user experience and app functionality.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Adjusted FAQ Entries to Match New Article IDs
INSERT INTO FAQ (Article_ID, Question, Answer) VALUES
-- Nutrition FAQs
(1, 'What should I eat before and after workouts?', 'Before a workout, focus on carbohydrates for energy. Post-workout, combine proteins and carbs for muscle recovery.'),
(1, 'How can I tailor my diet to my fitness goals?', 'Assess your caloric needs based on your activity level and goals, whether it’s weight loss, muscle gain, or maintenance, and adjust your intake of macros accordingly.'),
(2, 'How do I calculate my daily caloric needs?', 'Use our integrated calculator in the app, which considers your age, gender, activity level, and fitness goals.'),
(2, 'Is it necessary to track all macronutrients?', 'Tracking macronutrients can be very helpful for achieving specific fitness goals, though it’s more critical for certain objectives like muscle building or major weight changes.'),

-- Exercise FAQs
(3, 'How often should I change my workout routine?', 'It is recommended to review and possibly modify your routine every 4 to 6 weeks to avoid plateaus and to continue progressing.'),
(3, 'What are some effective cardio exercises for beginners?', 'Start with low-impact activities like walking or cycling. As your fitness improves, gradually introduce more challenging exercises like jogging or HIIT.'),
(4, 'What are the key safety tips for beginners in strength training?', 'Always start with lighter weights to master the form and gradually increase the weight. Ensure to warm up and cool down to prevent injuries.'),
(4, 'How often should beginners train each muscle group?', 'Beginners should aim to train each major muscle group twice a week with at least 48 hours of rest in between.'),

-- Mental Health FAQs
(5, 'Can exercise replace medication for mental health issues?', 'While exercise is beneficial, it should complement medication and therapy as prescribed by professionals, not replace them.'),
(5, 'What types of physical activities are best for mental health?', 'Activities that you enjoy, which can be anything from walking and cycling to more structured sports, are beneficial for mental health.'),
(6, 'How does meditation help reduce stress?', 'Meditation helps by reducing cortisol levels, improving your mood, and enhancing overall mental and emotional well-being.'),
(6, 'What are simple mindfulness exercises for beginners?', 'Try practices like focused breathing, sensory observation exercises, or guided imagery to begin incorporating mindfulness into your daily routine.'),

-- Booking FAQs
(7, 'What should I know before booking a session?', 'Check the availability of professionals, understand the session focus, and prepare any questions or topics in advance.'),
(7, 'How do I cancel or reschedule a booked session?', 'Use the booking interface in the app to view your upcoming sessions and select the option to cancel or reschedule as needed.'),
(8, 'How can I know more about the professional’s background?', 'Detailed profiles of each professional are available in our app, including their certifications, specialties, and patient reviews.'),
(8, 'What are the benefits of having a regular session?', 'Regular sessions can provide continuous support and monitoring, allowing for adjustments in your health plan as needed.'),

-- Scheduling FAQs
(9, 'How can I integrate meal plans into my schedule?', 'Select meals from the system and align them with your daily activities for optimal health and energy levels.'),
(9, 'What tools are available to track my fitness progress?', 'Use the tracking features in the app to monitor your workouts, progress, and analytics, helping you stay informed about your achievements.'),
(10, 'How to handle conflicting schedules in the app?', 'Our scheduling tool allows for real-time updates and alerts to help manage conflicts and reschedule appointments or activities.'),
(10, 'What features help with time management?', 'Features like reminders, priority settings, and integration with other calendars facilitate effective time management.'),

-- Community FAQs
(11, 'How do I start a new thread in the community?', 'Go to the Community section, select the appropriate forum, and use the “Create Thread” option to share your thoughts or questions.'),
(11, 'How can I follow other users and see their posts?', 'Visit the profile of the user you are interested in and select the follow option to stay updated with their posts and success stories.'),
(12, 'How to handle disagreements in the community?', 'Maintain respect and positivity, utilize moderators if needed, and engage in constructive dialogue.'),
(12, 'What are the rules for posting in the community?', 'Follow our community guidelines which emphasize respect, no spam, and relevance to fitness and health topics.'),

-- Wellness Hub FAQs
(13, 'What courses are available in the Wellness Hub?', 'Our Wellness Hub offers a range of courses from beginner yoga to advanced meditation practices.'),
(13, 'How can I benefit from the meditation section?', 'Engage with our guided meditation sessions to improve your mental clarity, reduce anxiety, and enhance your overall emotional resilience.'),
(14, 'What are the different types of yoga offered?', 'We offer various yoga styles including Hatha, Vinyasa, and Ashtanga, tailored to different levels of experience.'),
(14, 'How often should I practice yoga to see benefits?', 'Regular practice is recommended, but even 2-3 sessions per week can significantly enhance physical and mental health.'),

-- Feedback FAQs
(15, 'How do I report a problem with the app?', 'Use the Feedback section in the settings to describe the issue, provide screenshots if possible, and submit.'),
(15, 'Where can I see responses to my feedback?', 'Responses to your feedback will be sent directly to your registered email or can be viewed in the feedback section under "My Feedback Responses."'),
(16, 'How can I see the changes made based on feedback?', 'Updates based on user feedback are summarized in the app’s release notes and highlighted in our newsletters.'),
(16, 'How to ensure my feedback is noticed?', 'Be specific in your descriptions, provide context and suggest possible improvements. Priority is given to frequently mentioned issues.');



----------------------------------------------------------------------------------------
--------------------------------------- Terms -------------------------------------------
----------------------------------------------------------------------------------------
INSERT INTO TermCategory (name) VALUES
('User Agreement'),
('Privacy Policy'),
('Data Protection'),
('Usage Guidelines'),
('Subscription and Payments'),
('Cancellation and Refunds'),
('Health and Safety'),
('Intellectual Property');


-- User Agreement
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(1, 'User Responsibilities', 'Outlines what is expected from users when they interact with our app.', 'Users agree to engage with our platform in a respectful, legal manner, avoiding any forms of harassment, illegal activities, or behaviors that could harm other users or the service itself.', NOW(), NOW()),
(1, 'Account Security', 'Users are responsible for maintaining the security of their account credentials.', 'Users must notify the service provider immediately if any unauthorized use of their account is suspected or identified.', NOW(), NOW());

-- Privacy Policy
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(2, 'Data Collection', 'Details the type of data we collect from users.', 'By using our app, users consent to the collection of their personal data, such as health metrics, personal information, and usage stats.', NOW(), NOW()),
(2, 'Data Usage', 'Explains how we use collected data.', 'User data will be used to improve service offerings, personalize user experiences, and for targeted advertising, subject to user consent where applicable.', NOW(), NOW()),
(2, 'Third-Party Sharing', 'Outlines the circumstances under which we may share user data.', 'User data may be shared with third parties only under strict agreements that ensure the protection of that data, with user consent when required by law.', NOW(), NOW());

-- Data Protection
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(3, 'Data Security', 'Describes our data security measures.', 'We implement industry-standard security measures to protect user data, including encryption, firewalls, and secure server facilities.', NOW(), NOW()),
(3, 'User Rights', 'Details the rights users have concerning their data.', 'Users have the right to access, correct, and delete their personal data stored by our service at any time.', NOW(), NOW()),
(3, 'Data Breach Procedures', 'Procedures we follow in the event of a data breach.', 'In the event of a data breach, we will notify affected users and take immediate remedial actions to mitigate any potential harm.', NOW(), NOW());


-- Usage Guidelines
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(4, 'Content Standards', 'Specifies the standards expected for content uploaded by users.', 'Users agree to upload only content that is appropriate, respectful, and legally compliant, avoiding offensive, explicit, or harmful material.', NOW(), NOW()),
(4, 'Prohibited Activities', 'Details activities that are prohibited on the app.', 'Users agree not to engage in activities such as hacking, spamming, and conducting fraudulent activities. Any such activities will lead to immediate account termination.', NOW(), NOW());


-- Subscription and Payments
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(5, 'Subscription Models', 'Provides information on various subscription plans.', 'Users can choose from multiple subscription plans, which offer varying levels of access and features.', NOW(), NOW()),
(5, 'Payment Terms', 'Details the terms related to payment.', 'Users agree to timely payments based on the chosen subscription plan, and understand that failure to make payments may result in suspension of service.', NOW(), NOW()),
(5, 'Renewal and Cancellation', 'Outlines the procedures for subscription renewal and cancellation.', 'Subscriptions automatically renew under the initially agreed conditions unless cancelled by the user.', NOW(), NOW());

-- Cancellation and Refunds
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(6, 'Refund Policy', 'States the conditions under which refunds may be granted.', 'Refunds are available under certain conditions, such as non-conformity of service or unintentional renewal, and must be requested within a specified timeframe.', NOW(), NOW()),
(6, 'Early Termination Fees', 'Describes any fees that may be charged if a subscription is terminated before the end of its term.', 'Early termination of certain subscription plans may incur fees or penalties, as detailed in the subscription agreement.', NOW(), NOW());


-- Health and Safety
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(7, 'Health Disclaimer', 'Disclaimer regarding the non-medical nature of the app.', 'The app is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician with any questions regarding a medical condition.', NOW(), NOW()),
(7, 'Safety Tips', 'Provides safety tips for engaging in physical activities.', 'Users should follow suggested safety guidelines and instructions when participating in physical activities recommended by the app to prevent injuries.', NOW(), NOW());

-- Intellectual Property
INSERT INTO Terms (category_id, title, description, term, datecreated, dateupdated) VALUES
(8, 'Copyrights and Trademarks', 'Outlines the intellectual property rights concerning the app’s content.', 'Users acknowledge that all content, unless uploaded by them or specifically licensed, is owned by the app and protected by copyright and trademark laws.', NOW(), NOW()),
(8, 'Content Licensing', 'Details how user-generated content may be used by the company or other users.', 'By uploading content to the app, users grant the company a non-exclusive, worldwide, royalty-free license to use, reproduce, adapt, publish, translate, and distribute such content in any existing or future media.', NOW(), NOW());


-- INSERT INTO TermsAndConditions (TAC_ID, User_ID, DateCreated) VALUES
-- (1, 'example-user-id', CURRENT_TIMESTAMP);


-- INSERT INTO TermSet (TermSet_ID, TAC_ID, Term_ID) VALUES
-- (1, 1, 1),
-- (1, 1, 2),
-- (1, 1, 3);


----------------------------------------------------------------------------------------
--------------------------------------- Roles -------------------------------------------
----------------------------------------------------------------------------------------

INSERT INTO Role (Role_ID, Name, Description) VALUES
(1, 'User', 'A regular user with standard access to the application.'),
(2, 'Physio', 'A physiotherapist with permissions to manage physiotherapy sessions and view relevant patient data.'),
(3, 'Psychologist', 'A psychologist with access to manage therapy sessions and patient mental health records.'),
(4, 'Dietitian', 'A dietitian who can create and manage dietary plans and consultations.'),
(5, 'Admin', 'An administrator who has full access to all features and settings within the application.');

-- INSERT INTO UserRole (Role_ID, User_ID) VALUES
-- (1, '64d60a19-caa6-4d67-8954-fc1904fc98cc'), -- Athlete as User
-- (3, 'a8ca8bfd-c42c-4791-9068-22d3118b3de3'), -- Psychologist
-- (2, '55095241-b78a-4261-8c82-4c51cb5ca687'), -- Physio
-- (4, '24846e58-ccc6-4650-9fb8-1001d35b2f0b'); -- Dietitian


----------------------------------------------------------------------------------------
--------------------------------------- Statuses -------------------------------------------
----------------------------------------------------------------------------------------

INSERT INTO ProfessionalStatus (Status) VALUES
('Active'),
('Inactive'),
('Retired');

INSERT INTO ApprovedStatus (status) VALUES
('Pending'),
('Approved'),
('Declined');


----------------------------------------------------------------------------------------
--------------------------------------- Food -------------------------------------------
----------------------------------------------------------------------------------------
INSERT INTO FoodCategory (FoodCategory_ID, Name, Description) VALUES
(1, 'Fruits', 'All types of fresh fruits.'),
(2, 'Vegetables', 'Various kinds of vegetables including leafy greens.'),
(3, 'Proteins', 'Sources of protein such as meat, poultry, fish, and legumes.'),
(4, 'Dairy', 'Dairy products like milk, cheese, and yogurt.');

-- Update the Food table seed data with appropriate Category_IDs

INSERT INTO Food (FoodCategory_ID, Name) VALUES
(1, 'Oats'),
(1, 'Fruits'),
(3, 'Nuts'),
(2, 'Spinach'),
(2, 'Avocado'),
(3, 'Chicken'),
(2, 'Vegetables'),
(4, 'Greek Yogurt'),
(4, 'Honey'),
(3, 'Egg White'),
(2, 'Tomatoes'),
(1, 'Banana'),
(3, 'Protein Powder'),
(3, 'Beef'),
(1, 'Barley'),
(1, 'Berries'),
(1, 'Whole Grain'),
(4, 'Maple Syrup'),
(2, 'Kale'),
(1, 'Apple'),
(2, 'Tomato'),
(2, 'Basil'),
(1, 'Chia Seeds'),
(2, 'Avocado'),
(3, 'Poached Eggs'),
(4, 'Cottage Cheese'),
(1, 'Pineapple'),
(3, 'Smoked Salmon'),
(1, 'Mango'),
(2, 'Carrot'),
(3, 'Lentils'),
(1, 'Peach'),
(1, 'French Toast'),
(2, 'Mint'),
(2, 'Butternut Squash'),
(3, 'Granola'),
(4, 'Almond Milk'),
(3, 'Quinoa'),
(3, 'Beans'),
(3, 'Cheese'),
(1, 'Blueberry'),
(1, 'Cinnamon');

-- Seed the NutritionalFact table
INSERT INTO NutritionalFact (Food_ID, TotalCarbs, Calcium, Cholesterol, DietaryFiber, SaturatedFat, PolyunsaturatedFat, MonounsaturatedFat, TransFat, TotalFat, Iron, Potassium, Protein, Sugar, Sodium, VitaminA, VitaminC) VALUES
(1, 27, 2, 0, 4, 0, 1, 1, 0, 3, 10, 260, 5, 1, 0, 2, 0),
(2, 15, 10, 0, 3, 1, 2, 1, 0, 2, 5, 150, 1, 14, 1, 2, 7),
(3, 20, 5, 0, 4, 3, 1, 2, 0, 5, 3, 200, 7, 1, 0, 1, 0),
(4, 6, 10, 0, 3, 0, 0, 1, 0, 0, 5, 167, 2, 0, 0, 2, 13),
(5, 7, 20, 0, 1, 5, 1, 1, 0, 3, 15, 182, 6, 8, 36, 7, 0),
(6, 1, 15, 0, 0, 0, 0, 0, 0, 0, 1, 10, 0, 8, 0, 1, 2),
(7, 1, 16, 0, 0, 0, 0, 0, 0, 1, 2, 20, 0, 5, 1, 3, 6),
(8, 4, 100, 10, 0, 1, 0, 0, 0, 0, 0, 200, 6, 10, 100, 2, 1),
(9, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 167, 0, 0, 1, 0, 0),
(10, 1, 10, 0, 1, 0, 0, 0, 0, 0, 0, 50, 10, 0, 0, 1, 2),
(11, 3, 2, 0, 1, 0, 0, 0, 0, 0, 1, 100, 2, 1, 0, 1, 1),
(12, 27, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2),
(13, 3, 10, 0, 1, 0, 0, 0, 0, 0, 2, 100, 10, 0, 0, 1, 2),
(14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(15, 4, 2, 0, 1, 1, 0, 1, 0, 1, 2, 40, 5, 2, 20, 2, 1),
(16, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 25, 1, 3, 0, 1, 1),
(17, 25, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2),
(18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(19, 4, 2, 0, 1, 1, 0, 1, 0, 1, 2, 40, 5, 2, 20, 2, 1),
(20, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 25, 1, 3, 0, 1, 1),
(21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(22, 27, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2),
(23, 3, 10, 0, 1, 0, 0, 0, 0, 0, 2, 100, 10, 0, 0, 1, 2),
(24, 4, 2, 0, 1, 1, 0, 1, 0, 1, 2, 40, 5, 2, 20, 2, 1),
(25, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 25, 1, 3, 0, 1, 1),
(26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(27, 27, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2),
(28, 3, 10, 0, 1, 0, 0, 0, 0, 0, 2, 100, 10, 0, 0, 1, 2),
(29, 4, 2, 0, 1, 1, 0, 1, 0, 1, 2, 40, 5, 2, 20, 2, 1),
(30, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 25, 1, 3, 0, 1, 1),
(31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(32, 27, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2),
(33, 3, 10, 0, 1, 0, 0, 0, 0, 0, 2, 100, 10, 0, 0, 1, 2),
(34, 4, 2, 0, 1, 1, 0, 1, 0, 1, 2, 40, 5, 2, 20, 2, 1),
(35, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 25, 1, 3, 0, 1, 1),
(36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(37, 27, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2),
(38, 3, 10, 0, 1, 0, 0, 0, 0, 0, 2, 100, 10, 0, 0, 1, 2),
(39, 4, 2, 0, 1, 1, 0, 1, 0, 1, 2, 40, 5, 2, 20, 2, 1),
(40, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 25, 1, 3, 0, 1, 1),
(41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 1, 0, 0, 0),
(42, 27, 1, 0, 3, 0, 0, 0, 0, 0, 1, 60, 1, 5, 0, 1, 2);



----------------------------------------------------------------------------------------
--------------------------------------- Meals -------------------------------------------
----------------------------------------------------------------------------------------

INSERT INTO MealType (MealType_ID, MealType) VALUES
(1, 'Breakfast'),
(2, 'Lunch'),
(3, 'Dinner'),
(4, 'Snack');


INSERT INTO Meal (MealType_ID, Description, name, Price, pictureurl) VALUES
(1, 'Oatmeal with fruits and nuts', 'Oatmeal Delight', 5.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/OutmealDelight.png'),
(1, 'Egg white omelette with tomatoes and spinach', 'Healthy Omelette', 6.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/HealthyOmelette.png'),
(1, 'Whole grain pancakes with maple syrup', 'Grain Pancakes', 7.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/GrainPancakes.png'),
(1, 'Avocado toast with poached eggs', 'Avocado Toast', 8.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/AvocadoToast.png'),
(1, 'Scrambled eggs with smoked salmon', 'Salmon Scramble', 9.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/SalmonScramble.png'),
(1, 'French toast with berries', 'French Toast', 7.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/FrenchToast.png'),
(1, 'Quinoa breakfast bowl with eggs and avocado', 'Quinoa Bowl', 8.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/QuinoaBowl.png'),
(1, 'Breakfast burrito with beans and cheese', 'Breakfast Burrito', 6.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Breakfast/BreakfastBurrito.png'),
(2, 'Green smoothie with spinach and avocado', 'Green Smoothie', 4.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/GreenSmoothie.png'),
(2, 'Banana protein shake', 'Banana Shake', 5.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/BananaShake.png'),
(2, 'Kale and apple smoothie', 'Kale Apple Smoothie', 4.75, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/KaleAppleSmoothie.png'),
(2, 'Berry and spinach smoothie', 'Berry Spinach Smoothie', 4.25, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/BerrySpinachSmoothie.png'),
(2, 'Mango and carrot smoothie', 'Mango Carrot Smoothie', 4.75, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/MangoCarrotSmoothie.png'),
(2, 'Pineapple and mint smoothie', 'Pineapple Mint Smoothie', 4.25, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/PineappleMintSmoothie.png'),
(2, 'Strawberry banana smoothie', 'Strawberry Smoothie', 4.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/StawberrySmoothie.png'),
(2, 'Blueberry protein shake', 'Blueberry Shake', 4.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Lunch/BlueberryShake.png'),
(3, 'Chicken vegetable soup', 'Chicken Veggie Soup', 7.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/ChickenVeggieSoup.png'),
(3, 'Beef and barley soup', 'Beef Barley Soup', 8.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/BeefBarleySoup.png'),
(3, 'Tomato basil soup', 'Tomato Basil Soup', 6.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/TomatoBasilSoup.png'),
(3, 'Minestrone soup', 'Minestrone Soup', 7.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/MinestroneSoup.png'),
(3, 'Lentil and vegetable soup', 'Lentil Veggie Soup', 6.75, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/LentilVeggieSoup.png'),
(3, 'Butternut squash soup', 'Butternut Soup', 7.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/ButternutSoup.png'),
(3, 'Split pea soup with ham', 'Split Pea Soup', 7.75, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/SplitPeaSoup.png'),
(3, 'Creamy tomato soup', 'Creamy Tomato Soup', 6.75, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Dinner/CreamyTomatoSoup.png'),
(4, 'Greek yogurt with honey and berries', 'Yogurt Honey Delight', 3.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/YogurtHoneyDelight.png'),
(4, 'Mixed berry parfait', 'Berry Parfait', 4.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/BerryParfait.png'),
(4, 'Chia seed pudding', 'Chia Pudding', 3.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/ChiaPudding.png'),
(4, 'Cottage cheese with pineapple', 'Cottage Pineapple', 4.25, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/PeachYogurt.png'),
(4, 'Peach yogurt bowl', 'Peach Yogurt', 3.25, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/CottagePineapple.png'),
(4, 'Granola with almond milk', 'Granola Bowl', 4.00, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/GranolaBowl.png'),
(4, 'Vanilla chia pudding', 'Vanilla Chia Pudding', 3.75, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/VanillaChiaPudding.png'),
(4, 'Apple cinnamon oatmeal', 'Apple Oatmeal', 3.50, 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Meals/Snack/AppleOatmeal.png');


-- Instructions for Oatmeal Delight
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(1, 'Combine oats, fruits, and nuts in a bowl.'),
(1, 'Add water or milk to the bowl.'),
(1, 'Microwave or cook on stove until oats are tender.'),
(1, 'Stir and serve hot.');

-- Instructions for Green Smoothie
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(2, 'Place spinach and avocado in a blender.'),
(2, 'Add water or milk to the blender.'),
(2, 'Blend until smooth.'),
(2, 'Serve chilled.');

-- Instructions for Chicken Veggie Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(3, 'In a pot, add chicken and vegetables.'),
(3, 'Pour in enough water to cover the ingredients.'),
(3, 'Boil for 20 minutes until vegetables are tender.'),
(3, 'Season to taste and serve hot.');

-- Instructions for Yogurt Honey Delight
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(4, 'Place Greek yogurt in a bowl.'),
(4, 'Drizzle honey over the yogurt.'),
(4, 'Add berries on top.'),
(4, 'Serve immediately.');

-- Instructions for Healthy Omelette
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(5, 'Whisk egg whites in a bowl.'),
(5, 'Pour egg whites into a hot skillet.'),
(5, 'Add tomatoes and spinach.'),
(5, 'Cook until eggs are set. Serve hot.');

-- Instructions for Banana Shake
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(6, 'Peel and slice the banana.'),
(6, 'Add banana slices and protein powder to a blender.'),
(6, 'Add milk or water.'),
(6, 'Blend until smooth and serve chilled.');

-- Instructions for Beef Barley Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(7, 'In a pot, add beef, barley, and vegetables.'),
(7, 'Pour in enough water to cover the ingredients.'),
(7, 'Boil for 30 minutes until barley is tender.'),
(7, 'Season to taste and serve hot.');

-- Instructions for Berry Parfait
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(8, 'Layer Greek yogurt and berries in a glass.'),
(8, 'Repeat layers until the glass is full.'),
(8, 'Top with granola if desired.'),
(8, 'Serve immediately.');

-- Instructions for Grain Pancakes
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(9, 'Mix whole grain flour with water or milk.'),
(9, 'Pour batter onto a hot griddle.'),
(9, 'Cook until bubbles form and edges are dry. Flip and cook until golden.'),
(9, 'Serve with maple syrup.');

-- Instructions for Kale Apple Smoothie
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(10, 'Place kale and apple in a blender.'),
(10, 'Add water or milk.'),
(10, 'Blend until smooth.'),
(10, 'Serve chilled.');

-- Instructions for Tomato Basil Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(11, 'In a pot, add tomatoes and basil.'),
(11, 'Pour in enough water to cover the ingredients.'),
(11, 'Boil for 20 minutes until tomatoes are tender.'),
(11, 'Blend the soup until smooth and serve hot.');

-- Instructions for Chia Pudding
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(12, 'Mix chia seeds with Greek yogurt in a bowl.'),
(12, 'Refrigerate for at least 2 hours.'),
(12, 'Stir before serving.'),
(12, 'Serve chilled.');

-- Instructions for Avocado Toast
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(13, 'Toast whole grain bread slices.'),
(13, 'Mash avocado and spread on toast.'),
(13, 'Top with poached eggs.'),
(13, 'Serve immediately.');

-- Instructions for Berry Spinach Smoothie
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(14, 'Place berries and spinach in a blender.'),
(14, 'Add water or milk.'),
(14, 'Blend until smooth.'),
(14, 'Serve chilled.');

-- Instructions for Minestrone Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(15, 'In a pot, add mixed vegetables and beans.'),
(15, 'Pour in enough water to cover the ingredients.'),
(15, 'Boil for 25 minutes until vegetables are tender.'),
(15, 'Season to taste and serve hot.');

-- Instructions for Cottage Pineapple
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(16, 'Place cottage cheese in a bowl.'),
(16, 'Add pineapple chunks on top.'),
(16, 'Mix gently.'),
(16, 'Serve immediately.');

-- Instructions for Salmon Scramble
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(17, 'Whisk egg whites in a bowl.'),
(17, 'Pour egg whites into a hot skillet.'),
(17, 'Add smoked salmon.'),
(17, 'Cook until eggs are set. Serve hot.');

-- Instructions for Mango Carrot Smoothie
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(18, 'Place mango and carrot in a blender.'),
(18, 'Add water or milk.'),
(18, 'Blend until smooth.'),
(18, 'Serve chilled.');

-- Instructions for Lentil Veggie Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(19, 'In a pot, add lentils and mixed vegetables.'),
(19, 'Pour in enough water to cover the ingredients.'),
(19, 'Boil for 30 minutes until lentils are tender.'),
(19, 'Season to taste and serve hot.');

-- Instructions for Peach Yogurt
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(20, 'Place Greek yogurt in a bowl.'),
(20, 'Add peach slices on top.'),
(20, 'Mix gently.'),
(20, 'Serve immediately.');

-- Instructions for French Toast
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(21, 'Whisk eggs and milk in a bowl.'),
(21, 'Dip whole grain bread slices into the mixture.'),
(21, 'Cook on a hot griddle until golden brown on both sides.'),
(21, 'Serve with berries.');

-- Instructions for Pineapple Mint Smoothie
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(22, 'Place pineapple and mint in a blender.'),
(22, 'Add water or milk.'),
(22, 'Blend until smooth.'),
(22, 'Serve chilled.');

-- Instructions for Butternut Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(23, 'In a pot, add butternut squash and water.'),
(23, 'Boil for 20 minutes until squash is tender.'),
(23, 'Blend the soup until smooth.'),
(23, 'Season to taste and serve hot.');

-- Instructions for Granola Bowl
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(24, 'Place Greek yogurt in a bowl.'),
(24, 'Add granola on top.'),
(24, 'Mix gently.'),
(24, 'Serve immediately.');

-- Instructions for Quinoa Bowl
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(25, 'Cook quinoa according to package instructions.'),
(25, 'Place cooked quinoa in a bowl.'),
(25, 'Top with mashed avocado and poached eggs.'),
(25, 'Serve immediately.');

-- Instructions for Strawberry Smoothie
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(26, 'Place strawberries and banana in a blender.'),
(26, 'Add water or milk.'),
(26, 'Blend until smooth.'),
(26, 'Serve chilled.');

-- Instructions for Split Pea Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(27, 'In a pot, add split peas and ham.'),
(27, 'Pour in enough water to cover the ingredients.'),
(27, 'Boil for 30 minutes until peas are tender.'),
(27, 'Season to taste and serve hot.');

-- Instructions for Vanilla Chia Pudding
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(28, 'Mix chia seeds with Greek yogurt in a bowl.'),
(28, 'Add vanilla extract.'),
(28, 'Refrigerate for at least 2 hours.'),
(28, 'Stir before serving. Serve chilled.');

-- Instructions for Breakfast Burrito
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(29, 'Scramble eggs in a skillet.'),
(29, 'Warm tortilla in another skillet.'),
(29, 'Place scrambled eggs, beans, and cheese in the tortilla.'),
(29, 'Wrap the tortilla and serve hot.');

-- Instructions for Blueberry Shake
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(30, 'Place blueberries and protein powder in a blender.'),
(30, 'Add water or milk.'),
(30, 'Blend until smooth.'),
(30, 'Serve chilled.');

-- Instructions for Creamy Tomato Soup
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(31, 'In a pot, add tomatoes and basil.'),
(31, 'Pour in enough water to cover the ingredients.'),
(31, 'Boil for 20 minutes until tomatoes are tender.'),
(31, 'Blend the soup until smooth. Serve hot.');

-- Instructions for Apple Oatmeal
INSERT INTO MealInstruction (Meal_ID, Instruction) VALUES
(32, 'Combine oats and diced apple in a bowl.'),
(32, 'Add water or milk.'),
(32, 'Microwave or cook on stove until oats are tender.'),
(32, 'Stir and serve hot.');



-- Seed the MealFood table
INSERT INTO MealFood (Meal_ID, Food_ID, Quantity) VALUES
(1, 1, 1),  -- Oatmeal Delight: Oats
(1, 2, 2),  -- Oatmeal Delight: Fruits
(1, 3, 1),  -- Oatmeal Delight: Nuts
(2, 4, 1),  -- Green Smoothie: Spinach
(2, 5, 1),  -- Green Smoothie: Avocado
(3, 6, 1),  -- Chicken Veggie Soup: Chicken
(3, 7, 1),  -- Chicken Veggie Soup: Vegetables
(4, 8, 1),  -- Yogurt Honey Delight: Greek Yogurt
(4, 9, 1),  -- Yogurt Honey Delight: Honey
(5, 10, 1), -- Healthy Omelette: Egg White
(5, 11, 1), -- Healthy Omelette: Tomatoes
(5, 4, 1),  -- Healthy Omelette: Spinach
(6, 12, 1), -- Banana Shake: Banana
(6, 13, 1), -- Banana Shake: Protein Powder
(7, 14, 1), -- Beef Barley Soup: Beef
(7, 15, 1), -- Beef Barley Soup: Barley
(7, 7, 1),  -- Beef Barley Soup: Vegetables
(8, 16, 1), -- Berry Parfait: Berries
(8, 8, 1),  -- Berry Parfait: Greek Yogurt
(9, 17, 1), -- Grain Pancakes: Whole Grain
(9, 18, 1), -- Grain Pancakes: Maple Syrup
(10, 19, 1),-- Kale Apple Smoothie: Kale
(10, 20, 1),-- Kale Apple Smoothie: Apple
(11, 21, 1),-- Tomato Basil Soup: Tomato
(11, 22, 1),-- Tomato Basil Soup: Basil
(12, 23, 1),-- Chia Pudding: Chia Seeds
(12, 8, 1), -- Chia Pudding: Greek Yogurt
(13, 24, 1),-- Avocado Toast: Avocado
(13, 25, 1),-- Avocado Toast: Poached Eggs
(14, 16, 1),-- Berry Spinach Smoothie: Berries
(14, 4, 1), -- Berry Spinach Smoothie: Spinach
(15, 7, 1), -- Minestrone Soup: Vegetables
(16, 26, 1),-- Cottage Pineapple: Cottage Cheese
(16, 27, 1),-- Cottage Pineapple: Pineapple
(17, 28, 1),-- Salmon Scramble: Smoked Salmon
(17, 10, 1),-- Salmon Scramble: Egg White
(18, 29, 1),-- Mango Carrot Smoothie: Mango
(18, 30, 1),-- Mango Carrot Smoothie: Carrot
(19, 31, 1),-- Lentil Veggie Soup: Lentils
(19, 7, 1), -- Lentil Veggie Soup: Vegetables
(20, 32, 1),-- Peach Yogurt: Greek Yogurt
(20, 33, 1),-- Peach Yogurt: Peach
(21, 34, 1),-- French Toast: Whole Grain
(21, 35, 1),-- French Toast: Berries
(22, 36, 1),-- Pineapple Mint Smoothie: Pineapple
(22, 37, 1),-- Pineapple Mint Smoothie: Mint
(23, 38, 1),-- Butternut Soup: Butternut Squash
(24, 39, 1),-- Granola Bowl: Granola
(24, 8, 1), -- Granola Bowl: Greek Yogurt
(25, 38, 1),-- Quinoa Bowl: Quinoa
(25, 24, 1),-- Quinoa Bowl: Avocado
(25, 25, 1),-- Quinoa Bowl: Poached Eggs
(26, 16, 1),-- Strawberry Smoothie: Berries
(26, 20, 1),-- Strawberry Smoothie: Apple
(27, 40, 1),-- Split Pea Soup: Split Peas
(27, 7, 1), -- Split Pea Soup: Vegetables
(28, 23, 1),-- Vanilla Chia Pudding: Chia Seeds
(28, 8, 1), -- Vanilla Chia Pudding: Greek Yogurt
(29, 41, 1),-- Breakfast Burrito: Beans
(29, 40, 1),-- Breakfast Burrito: Cheese
(30, 41, 1),-- Blueberry Shake: Blueberries
(30, 13, 1),-- Blueberry Shake: Protein Powder
(31, 21, 1),-- Creamy Tomato Soup: Tomato
(31, 22, 1),-- Creamy Tomato Soup: Basil
(32, 20, 1),-- Apple Oatmeal: Apple
(32, 1, 1); -- Apple Oatmeal: Oats



----------------------------------------------------------------------------------------
--------------------------------------- Workouts -------------------------------------------
----------------------------------------------------------------------------------------
--Exercise
INSERT INTO BodyPart (id, Name, Description) VALUES
(1, 'Legs', 'Includes all muscles in the lower extremity including thighs and calves.'),
(2, 'Arms', 'Includes upper limbs, focusing on biceps, triceps, and forearms.'),
(3, 'Chest', 'Pectoral muscles that cover the upper front torso.'),
(4, 'Back', 'Upper and lower back muscles including latissimus dorsi and spinal erectors.'),
(5, 'Core', 'Abdominal and lower back muscles that support the spine and torso.');

-- Legs
INSERT INTO Exercise (BodyPart_ID, Name, Description, Sets, Repititions, Duration, Weight) VALUES
(1, 'Squat', 'A compound movement targeting the thighs and glutes, performed by bending the knees and lowering the body into a seated position.', 4, 12, 15, 50),
(1, 'Leg Press', 'A machine-based exercise that targets the quads, hamstrings, and glutes by pushing a weighted platform away from the body using the legs.', 3, 10, 15, 100),
(1, 'Lunges', 'Targets quads, hamstrings, and glutes by stepping forward into a deep lunge position and returning to a standing position.', 3, 12, 15, 30),
(1, 'Calf Raises', 'Focuses on strengthening the calf muscles by raising the heels off the ground while standing.', 4, 15, 15, 20);

-- Arms
INSERT INTO Exercise (BodyPart_ID, Name, Description, Sets, Repititions, Duration, Weight) VALUES
(2, 'Bicep Curl', 'An isolation exercise that targets the biceps by curling a weight towards the shoulders.', 3, 10, 10, 15),
(2, 'Tricep Dips', 'Targets the triceps by lowering and raising the body using the arms while seated or with hands on a bench.', 3, 12, 15, NULL),
(2, 'Hammer Curl', 'A variation of the bicep curl that targets both the biceps and forearms by holding dumbbells in a neutral grip.', 3, 10, 15, 20),
(2, 'Overhead Tricep Extension', 'Targets the triceps by extending a weight overhead, isolating the triceps muscle.', 3, 12, 20, 25);

-- Chest
INSERT INTO Exercise (BodyPart_ID, Name, Description, Sets, Repititions, Duration, Weight) VALUES
(3, 'Bench Press', 'A compound movement focusing on the pectoral muscles by pressing a barbell or dumbbells upward while lying on a bench.', 4, 10, 10, 60),
(3, 'Push-Ups', 'A bodyweight exercise that targets the chest by lowering and raising the body using arm strength while lying prone.', 3, 15, 15, NULL),
(3, 'Incline Dumbbell Press', 'Similar to the bench press, but performed at an incline to target the upper portion of the pectoral muscles.', 3, 10, 15, 50),
(3, 'Chest Flyes', 'Targets the chest muscles by extending and lowering dumbbells to the side while lying on a bench, then bringing them back together.', 3, 12, 15, 25);


-- Back
INSERT INTO Exercise (BodyPart_ID, Name, Description, Sets, Repititions, Duration, Weight) VALUES
(4, 'Deadlift', 'A compound movement targeting the entire posterior chain, focusing on the lower back, hamstrings, and glutes by lifting a barbell from the ground to the hips.', 4, 8, 20, 100),
(4, 'Pull-Ups', 'Targets the upper back and lats by pulling the body up towards a bar using upper body strength.', 3, 8, 15, NULL),
(4, 'Bent-Over Row', 'Strengthens the back muscles by pulling a barbell or dumbbells toward the torso while bent over.', 3, 10, 10, 50),
(4, 'Lat Pulldown', 'Focuses on the latissimus dorsi by pulling a bar down toward the chest on a lat pulldown machine.', 3, 10, 10, 80);


-- Core
INSERT INTO Exercise (BodyPart_ID, Name, Description, Sets, Repititions, Duration, Weight) VALUES
(5, 'Plank', 'An isometric core exercise that involves holding a static position to strengthen the core muscles.', 3, 1, 8, NULL),
(5, 'Russian Twist', 'Targets the oblique muscles by twisting the torso from side to side while seated and holding a weight.', 3, 15, 10, 20),
(5, 'Leg Raise', 'Strengthens the lower abdominal muscles by lifting the legs while lying flat on the back.', 3, 12, 16, NULL),
(5, 'Bicycle Crunch', 'Targets the entire core by performing a crunch movement while alternating the legs in a pedaling motion.', 3, 15, 16, NULL);

--------------------------- ExerciseInstruction ---------------------------
-- Squat
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(1, 'Stand with your feet shoulder-width apart.'),
(1, 'Keep your chest up and back straight.'),
(1, 'Lower your body by bending your knees and hips, as if sitting down on a chair.'),
(1, 'Go down until your thighs are parallel to the floor.'),
(1, 'Press through your heels to return to the starting position.');

-- Leg Press
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(2, 'Sit on the leg press machine with your feet flat on the platform, shoulder-width apart.'),
(2, 'Adjust the seat so your legs are at a 90-degree angle.'),
(2, 'Grip the handles for stability.'),
(2, 'Push the platform away from you by extending your legs, but do not lock your knees.'),
(2, 'Slowly return the platform to the starting position by bending your knees.');


-- Lunges
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(3, 'Stand upright with your feet together and dumbbells in each hand (optional).'),
(3, 'Step forward with one leg, lowering your hips until both knees are bent at a 90-degree angle.'),
(3, 'Ensure your front knee is directly above your ankle and your back knee does not touch the floor.'),
(3, 'Push through your front heel to return to the starting position.'),
(3, 'Repeat on the other leg.');


-- Calf Raises
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(4, 'Stand upright with your feet hip-width apart and dumbbells in each hand (optional).'),
(4, 'Slowly raise your heels off the ground, balancing on the balls of your feet.'),
(4, 'Hold the top position for a moment, feeling the contraction in your calves.'),
(4, 'Slowly lower your heels back to the starting position.');


-- Bicept Curl
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(5, 'Stand with your feet shoulder-width apart, holding a dumbbell in each hand.'),
(5, 'Keep your elbows close to your torso and palms facing forward.'),
(5, 'Curl the weights while contracting your biceps until your forearms are vertical and the weights are at shoulder level.'),
(5, 'Slowly lower the dumbbells back to the starting position.');


-- Tricep Dips
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(6, 'Position your hands shoulder-width apart on a bench or a stable surface behind you.'),
(6, 'Extend your legs out in front of you, with your heels on the ground and toes pointing up.'),
(6, 'Lower your body by bending your elbows until your upper arms are parallel to the ground.'),
(6, 'Push through your palms to straighten your arms and return to the starting position.');


-- Hammer Curl
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(7, 'Stand with your feet shoulder-width apart, holding a dumbbell in each hand with a neutral grip (palms facing each other).'),
(7, 'Keep your elbows close to your torso.'),
(7, 'Curl the weights while contracting your biceps until your forearms are vertical and the weights are at shoulder level.'),
(7, 'Slowly lower the dumbbells back to the starting position.');


-- Overhead Tricep Extension
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(8, 'Stand or sit with your feet shoulder-width apart, holding a dumbbell with both hands.'),
(8, 'Lift the dumbbell overhead until your arms are fully extended.'),
(8, 'Slowly lower the dumbbell behind your head by bending your elbows, keeping your upper arms close to your ears.'),
(8, 'Extend your arms to return the dumbbell to the starting position.');


-- Bench Press
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(9, 'Lie back on a flat bench with your feet flat on the ground.'),
(9, 'Grip the barbell with hands slightly wider than shoulder-width apart.'),
(9, 'Lower the barbell to your chest, keeping your elbows at about a 45-degree angle.'),
(9, 'Press the barbell back up until your arms are fully extended.');


-- Push-ups
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(10, 'Start in a high plank position with your hands slightly wider than shoulder-width apart.'),
(10, 'Keep your body in a straight line from head to heels.'),
(10, 'Lower your body until your chest nearly touches the floor, keeping your elbows close to your body.'),
(10, 'Push back up to the starting position.');


-- Incline Dumbbell Press
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(11, 'Sit on an incline bench set at a 30-45 degree angle, holding a dumbbell in each hand.'),
(11, 'Lift the dumbbells to shoulder height with your palms facing forward.'),
(11, 'Press the dumbbells up until your arms are fully extended, directly over your chest.'),
(11, 'Slowly lower the dumbbells back to the starting position.');


-- Chest Flyes
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(12, 'Lie back on a flat bench with a dumbbell in each hand, arms extended directly above your chest.'),
(12, 'Keep a slight bend in your elbows as you lower the dumbbells out to the sides, forming a wide arc.'),
(12, 'Lower the dumbbells until they are at chest level, feeling a stretch in your chest.'),
(12, 'Bring the dumbbells back together to the starting position, following the same arc.');


-- Deadlift
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(13, 'Stand with your feet hip-width apart, toes under the barbell.'),
(13, 'Bend at your hips and knees to grip the bar with hands just outside your knees.'),
(13, 'Keep your back flat and chest up as you lift the bar by extending your hips and knees.'),
(13, 'Stand tall with your shoulders back at the top of the lift.'),
(13, 'Lower the bar back to the ground by bending your hips and knees.');


-- Pull-ups
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(14, 'Grip a pull-up bar with your palms facing away from you and hands slightly wider than shoulder-width apart.'),
(14, 'Start from a dead hang with your arms fully extended.'),
(14, 'Pull your body up until your chin is above the bar.'),
(14, 'Slowly lower yourself back to the starting position.');

-- Bent-Over Row
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(15, 'Stand with your feet shoulder-width apart, holding a barbell with an overhand grip.'),
(15, 'Bend at your hips and knees, keeping your back flat and chest up.'),
(15, 'Pull the barbell towards your torso, squeezing your shoulder blades together at the top.'),
(15, 'Slowly lower the barbell back to the starting position.');


-- Lat Pulldown
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(16, 'Sit at a lat pulldown machine with your knees under the pad and feet flat on the floor.'),
(16, 'Grip the bar with a wide overhand grip.'),
(16, 'Lean back slightly and pull the bar down towards your chest, leading with your elbows.'),
(16, 'Slowly return the bar to the starting position.');


-- Plank
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(17, 'Start in a forearm plank position with your elbows directly under your shoulders.'),
(17, 'Keep your body in a straight line from head to heels.'),
(17, 'Engage your core and hold the position for the desired duration.'),
(17, 'Avoid letting your hips sag or raise too high.');


-- Russian Twist 
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(18, 'Sit on the floor with your knees bent and feet flat.'),
(18, 'Lean back slightly to balance on your sit bones and hold a weight in front of your chest.'),
(18, 'Twist your torso to one side, then twist to the opposite side, keeping your core engaged.'),
(18, 'Continue alternating sides for the desired number of repetitions.');


-- Leg raise
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(19, 'Lie flat on your back with your legs straight and arms at your sides.'),
(19, 'Lift your legs towards the ceiling while keeping them straight.'),
(19, 'Stop when your legs are perpendicular to the floor, then slowly lower them back down.'),
(19, 'Avoid letting your lower back arch off the floor during the movement.');


-- Bycycle Crunch
INSERT INTO ExerciseInstruction (exercise_id, instruction) VALUES
(20, 'Lie flat on your back with your hands behind your head and legs lifted, knees bent.'),
(20, 'Bring one knee towards your chest while twisting your torso to bring the opposite elbow towards that knee.'),
(20, 'Simultaneously extend the other leg straight out.'),
(20, 'Alternate sides in a pedaling motion for the desired number of repetitions.');



--------------------------- Equipment ---------------------------
INSERT INTO Equipment (name, description, pictureurl) VALUES
('Barbell', 'A long bar used for loading weights, held across the shoulders or in the hands during various exercises.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/Barbell.png'),
('Leg Press Machine', 'A machine designed to target the lower body by pushing a weighted platform away using the legs.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/LegPressMachine.png'),
('Dumbbells', 'A pair of hand-held weights used for a variety of exercises.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/Dumbells.png'),
('Step Platform', 'A raised platform used to increase the range of motion during calf raises or other step exercises.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/StepPlatform.png'),
('Bench', 'A flat or adjustable bench used for a variety of exercises including presses and dips.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/Bench.png'),
('EZ Curl Bar', 'A short bar with angled grips, used for exercises like bicep curls and tricep extensions.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/EzCurlBar.png'),
('Pull-Up Bar', 'A horizontal bar used for performing pull-ups and chin-ups.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/PullUpBar.png'),
('Resistance Bands', 'Elastic bands that can assist in performing exercises by adding or reducing resistance.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/ResistanceBands.png'),
('Lat Pulldown Machine', 'A machine designed to target the back by pulling a bar down towards the chest.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/LatPulldownMachine.png'),
('Cable Machine', 'A versatile machine with a pulley system used for various exercises, including lat pulldowns.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/CableMachine.png'),
('Medicine Ball', 'A weighted ball used during core exercises to add resistance.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Equipment/MedicineBall.png');


--------------------------- ExerciseEquipment ---------------------------
-- Squat
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(1, (SELECT id FROM Equipment WHERE name = 'Barbell'));

-- Leg Press
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(2, (SELECT id FROM Equipment WHERE name = 'Leg Press Machine'));

-- Lunges
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(3, (SELECT id FROM Equipment WHERE name = 'Dumbbells'));

-- Calf Raises
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(4, (SELECT id FROM Equipment WHERE name = 'Dumbbells')),
(4, (SELECT id FROM Equipment WHERE name = 'Step Platform'));

-- Bicep Curl
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(5, (SELECT id FROM Equipment WHERE name = 'Dumbbells')),
(5, (SELECT id FROM Equipment WHERE name = 'Barbell'));

-- Tricep Dips
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(6, (SELECT id FROM Equipment WHERE name = 'Bench'));

-- Hammer Curl
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(7, (SELECT id FROM Equipment WHERE name = 'Dumbbells'));

-- Overhead Tricep Extension
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(8, (SELECT id FROM Equipment WHERE name = 'Dumbbells')),
(8, (SELECT id FROM Equipment WHERE name = 'EZ Curl Bar'));

-- Bench Press
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(9, (SELECT id FROM Equipment WHERE name = 'Barbell')),
(9, (SELECT id FROM Equipment WHERE name = 'Bench'));

-- Incline Dumbbell Press
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(11, (SELECT id FROM Equipment WHERE name = 'Dumbbells')),
(11, (SELECT id FROM Equipment WHERE name = 'Bench'));

-- Chest Flyes
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(12, (SELECT id FROM Equipment WHERE name = 'Dumbbells')),
(12, (SELECT id FROM Equipment WHERE name = 'Bench'));

-- Deadlift
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(13, (SELECT id FROM Equipment WHERE name = 'Barbell'));

-- Pull-Ups
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(14, (SELECT id FROM Equipment WHERE name = 'Pull-Up Bar')),
(14, (SELECT id FROM Equipment WHERE name = 'Resistance Bands'));

-- Bent-Over Row
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(15, (SELECT id FROM Equipment WHERE name = 'Barbell')),
(15, (SELECT id FROM Equipment WHERE name = 'Dumbbells'));

-- Lat Pulldown
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(16, (SELECT id FROM Equipment WHERE name = 'Lat Pulldown Machine')),
(16, (SELECT id FROM Equipment WHERE name = 'Cable Machine'));

-- Russian Twist
INSERT INTO ExerciseEquipment (exercise_id, equipment_id) VALUES
(18, (SELECT id FROM Equipment WHERE name = 'Medicine Ball')),
(18, (SELECT id FROM Equipment WHERE name = 'Dumbbells'));


INSERT INTO Workout (name, description, pictureurl, DateCreated) VALUES
('Leg Day', 'A comprehensive lower body workout focusing on strengthening the thighs, glutes, and calves.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Workouts/LegDay.jpg', NOW());
INSERT INTO WorkoutExercise (Workout_ID, Exercise_ID) VALUES
(1, (SELECT id FROM Exercise WHERE Name = 'Squat')),
(1, (SELECT id FROM Exercise WHERE Name = 'Leg Press')),
(1, (SELECT id FROM Exercise WHERE Name = 'Lunges')),
(1, (SELECT id FROM Exercise WHERE Name = 'Calf Raises'));


INSERT INTO Workout (name, description, pictureurl, DateCreated) VALUES
('Arm Strength', 'This workout focuses on building upper arm strength, targeting the biceps and triceps.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Workouts/ArmStrength.jpg', NOW());
INSERT INTO WorkoutExercise (Workout_ID, Exercise_ID) VALUES
(2, (SELECT id FROM Exercise WHERE Name = 'Bicep Curl')),
(2, (SELECT id FROM Exercise WHERE Name = 'Tricep Dips')),
(2, (SELECT id FROM Exercise WHERE Name = 'Hammer Curl')),
(2, (SELECT id FROM Exercise WHERE Name = 'Overhead Tricep Extension'));


INSERT INTO Workout (name, description, pictureurl, DateCreated) VALUES
('Chest & Back Blast', 'A powerful workout focusing on upper body strength by targeting the chest and back muscles.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Workouts/ChestAndBack.jpg', NOW());
INSERT INTO WorkoutExercise (Workout_ID, Exercise_ID) VALUES
(3, (SELECT id FROM Exercise WHERE Name = 'Bench Press')),
(3, (SELECT id FROM Exercise WHERE Name = 'Push-Ups')),
(3, (SELECT id FROM Exercise WHERE Name = 'Deadlift')),
(3, (SELECT id FROM Exercise WHERE Name = 'Bent-Over Row'));


INSERT INTO Workout (name, description, pictureurl, DateCreated) VALUES
('Core Stability', 'A focused core workout designed to strengthen the abdominal muscles and improve stability.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Workouts/Core.jpg', NOW());
INSERT INTO WorkoutExercise (Workout_ID, Exercise_ID) VALUES
(4, (SELECT id FROM Exercise WHERE Name = 'Plank')),
(4, (SELECT id FROM Exercise WHERE Name = 'Russian Twist')),
(4, (SELECT id FROM Exercise WHERE Name = 'Leg Raise')),
(4, (SELECT id FROM Exercise WHERE Name = 'Bicycle Crunch'));


INSERT INTO Workout (name, description, pictureurl, DateCreated) VALUES
('Full Body Routine', 'A balanced workout that targets multiple muscle groups for overall strength and conditioning.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Workouts/FullBody.jpg', NOW());
INSERT INTO WorkoutExercise (Workout_ID, Exercise_ID) VALUES
(5, (SELECT id FROM Exercise WHERE Name = 'Squat')),
(5, (SELECT id FROM Exercise WHERE Name = 'Bench Press')),
(5, (SELECT id FROM Exercise WHERE Name = 'Deadlift')),
(5, (SELECT id FROM Exercise WHERE Name = 'Plank'));


INSERT INTO Workout (name, description, pictureurl, DateCreated) VALUES
('Upper Body Pump', 'An upper body workout focused on enhancing muscle tone and strength in the chest, back, and arms.', 'https://hqnzzdhfqcsmdcuebriy.supabase.co/storage/v1/object/public/Public/Workouts/UpperBody.jpg', NOW());
INSERT INTO WorkoutExercise (Workout_ID, Exercise_ID) VALUES
(6, (SELECT id FROM Exercise WHERE Name = 'Incline Dumbbell Press')),
(6, (SELECT id FROM Exercise WHERE Name = 'Lat Pulldown')),
(6, (SELECT id FROM Exercise WHERE Name = 'Bicep Curl')),
(6, (SELECT id FROM Exercise WHERE Name = 'Overhead Tricep Extension'));







----------------------------------------------------------------------------------------
--------------------------------------- Assessments -------------------------------------------
----------------------------------------------------------------------------------------
INSERT INTO Goals (name) VALUES 
('I want to reduce stress.'),
('I want to be more active.'),
('I want to eat healthier.'),
('I want to manage my time better.'),
('Just trying out the app!');

INSERT INTO Moods (name) VALUES
('Over the Moon'),
('Happy'),
('Neutral'),
('Sad'),
('Under the Moon');

INSERT INTO SleepQuality (name, hours) VALUES
('Excellent', '7-9 Hours'),
('Good', '6-7 Hours'),
('Fair', '5 Hours'),
('Poor', '3-4 Hours'),
('Worst', '<3 Hours');

INSERT INTO TakingMedication (name) VALUES
('Prescribed Medications'),
('Over the Counter Medications'),
('I''m Not taking any'),
('Prefer not to say');

INSERT INTO Medication (name) VALUES
('Acetaminophen'),
('Acyclovir'),
('Adalimumab'),
('Albuterol'),
('Alendronate'),
('Allopurinol'),
('Alprazolam'),
('Amiodarone'),
('Amitriptyline'),
('Amlodipine'),
('Amoxicillin'),
('Amphetamine/Dextroamphetamine'),
('Anastrozole'),
('Apixaban'),
('Aripiprazole'),
('Aspirin'),
('Atazanavir'),
('Atenolol'),
('Atorvastatin'),
('Azithromycin'),
('Baclofen'),
('Benazepril'),
('Bimatoprost'),
('Bisoprolol'),
('Budesonide'),
('Buprenorphine'),
('Bupropion'),
('Buspirone'),
('Calcitriol'),
('Candesartan'),
('Captopril'),
('Carbamazepine'),
('Carvedilol'),
('Cefdinir'),
('Cefixime'),
('Cefuroxime'),
('Celecoxib'),
('Cephalexin'),
('Chlorpheniramine'),
('Ciprofloxacin'),
('Citalopram'),
('Clarithromycin'),
('Clindamycin'),
('Clobetasol'),
('Clonazepam'),
('Clonidine'),
('Clopidogrel'),
('Codeine'),
('Cyclobenzaprine'),
('Dabigatran'),
('Dapoxetine'),
('Desloratadine'),
('Dexamethasone'),
('Diazepam'),
('Diclofenac'),
('Digoxin'),
('Diltiazem'),
('Diphenhydramine'),
('Divalproex'),
('Donepezil'),
('Doxycycline'),
('Duloxetine'),
('Enalapril'),
('Erythromycin'),
('Escitalopram'),
('Esomeprazole'),
('Estradiol'),
('Ezetimibe'),
('Famotidine'),
('Felodipine'),
('Fenofibrate'),
('Fentanyl'),
('Finasteride'),
('Fluconazole'),
('Fluoxetine'),
('Fluticasone'),
('Furosemide'),
('Gabapentin'),
('Galantamine'),
('Gatifloxacin'),
('Gemfibrozil'),
('Glimepiride'),
('Glipizide'),
('Glyburide'),
('Guaifenesin'),
('Haloperidol'),
('Hydrochlorothiazide'),
('Hydrocodone'),
('Hydroxyzine'),
('Ibuprofen'),
('Imatinib'),
('Indomethacin'),
('Insulin Glargine'),
('Ipratropium'),
('Irbesartan'),
('Isoniazid'),
('Isosorbide'),
('Itraconazole'),
('Ivermectin'),
('Ketoconazole'),
('Labetalol'),
('Lacosamide'),
('Lamotrigine'),
('Lansoprazole'),
('Latanoprost'),
('Letrozole'),
('Levofloxacin'),
('Levothyroxine'),
('Lisinopril'),
('Loratadine'),
('Losartan'),
('Lovastatin');


INSERT INTO MentalHealthSymptom (name) VALUES
('Anxiety'),
('Depression'),
('Mood swings'),
('Insomnia or excessive sleeping'),
('Persistent sadness'),
('Fatigue or low energy'),
('Irritability or anger'),
('Changes in appetite (increase or decrease)'),
('Difficulty concentrating'),
('Feelings of guilt or worthlessness'),
('Loss of interest in activities'),
('Social withdrawal'),
('Suicidal thoughts'),
('Panic attacks'),
('Paranoia');


----------------------------------------------------------------------------------------
--------------------------------------- Ai Templates -------------------------------------------
----------------------------------------------------------------------------------------

INSERT INTO AiResponseTemplate (AiResponseTemplate_ID, Template, DateCreated, DateUpdated) VALUES
(1, 'Provide a summary of user {user_id} fitness progress over the last month.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Generate a motivational message for user {user_id} who has missed their workout for 3 days in a row.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Suggest a recovery routine for user {user_id} after reporting muscle soreness.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Offer dietary advice for user {user_id} aiming to lose weight.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Create a relaxation technique recommendation for user {user_id} who has been experiencing high stress levels.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO Tag(name, datecreated)
VALUES
  ('Food', current_timestamp),
  ('Workout', current_timestamp),
  ('Yoga', current_timestamp),
  ('Meditation', current_timestamp),
  ('Nutrition', current_timestamp),
  ('Recipes', current_timestamp),
  ('Cardio', current_timestamp),
  ('Strength Training', current_timestamp),
  ('Flexibility', current_timestamp),
  ('Recovery', current_timestamp),
  ('Mental Health', current_timestamp),
  ('Weight Loss', current_timestamp),
  ('Muscle Building', current_timestamp),
  ('Motivation', current_timestamp),
  ('Fitness Challenges', current_timestamp),
  ('Hydration', current_timestamp),
  ('Sleep', current_timestamp),
  ('Supplements', current_timestamp),
  ('Injury Prevention', current_timestamp),
  ('Running', current_timestamp),
  ('Cycling', current_timestamp),
  ('HIIT', current_timestamp),
  ('Home Workouts', current_timestamp),
  ('Gym Equipment', current_timestamp),
  ('Wellness', current_timestamp),
  ('Mindfulness', current_timestamp),
  ('Healthy Habits', current_timestamp),
  ('Personal Training', current_timestamp),
  ('Fitness Gear', current_timestamp),
  ('Stretching', current_timestamp),
  ('Postpartum Fitness', current_timestamp);
----------------------------------------------------------------------------------------
--------------------------------------- Tracking -------------------------------------------
----------------------------------------------------------------------------------------
-- INSERT INTO CycleStatus (status, description) VALUES 
-- ('Ongoing', 'Your current cycle is still in progress. This means your period has started and is ongoing.'),
-- ('Completed', 'Your cycle has ended. All relevant data, such as your period length, has been recorded.'),
-- ('Skipped', 'It seems this cycle was skipped or didn''t occur as expected. This can happen for various reasons, including stress, health conditions, or pregnancy.'),
-- ('Irregular', 'This cycle has been identified as irregular, meaning it''s different from your typical pattern. It''s normal to have variations sometimes.'),
-- ('Delayed', 'This cycle started later than expected. Delays can happen due to stress, lifestyle changes, or health reasons.'),
-- ('Early', 'This cycle started earlier than anticipated. Changes like this can occur due to stress or other factors.'),
-- ('Anovulatory', 'This cycle occurred without ovulation. This is common in some conditions and usually not a cause for concern.'),
-- ('Pregnant', 'Your tracking suggests that you might be pregnant. If confirmed, cycles are usually paused during pregnancy.'),
-- ('Menopause', 'You have entered menopause, which means your periods have ceased. This is a natural phase of life.'),
-- ('Pending', 'Your next cycle is expected to start soon based on previous patterns, but it hasn''t started yet.'),
-- ('Under Observation', 'We''re keeping a close eye on this cycle due to some unusual symptoms or irregularities you reported. This helps in understanding your cycle better.');

