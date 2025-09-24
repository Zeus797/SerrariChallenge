import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import Header from '@/components/Header';
import TestQuestion from '@/components/TestQuestion';
import TestResults from '@/components/TestResults';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TestSession, TestQuestion as TestQuestionType } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// todo: remove mock functionality - replace with real data from backend
const mockQuestions: Record<string, TestQuestionType[]> = {
  'acca': [
    {
      id: 'acca-q1',
      question: 'Which of the following is the primary purpose of financial statements according to ACCA standards?',
      options: [
        'To provide tax information to government authorities',
        'To provide information about financial position, performance, and cash flows',
        'To determine employee compensation packages',
        'To calculate insurance premiums for the business'
      ],
      correctAnswer: 1,
      explanation: 'According to ACCA standards, the primary purpose of financial statements is to provide information about the financial position, financial performance, and cash flows of an entity that is useful to a wide range of users in making economic decisions.',
      topic: 'Financial Reporting'
    },
    {
      id: 'acca-q2',
      question: 'What is the fundamental accounting equation?',
      options: [
        'Revenue - Expenses = Profit',
        'Assets = Liabilities + Equity',
        'Cash In - Cash Out = Net Cash Flow',
        'Sales - Cost of Sales = Gross Profit'
      ],
      correctAnswer: 1,
      explanation: 'The fundamental accounting equation is Assets = Liabilities + Equity. This equation must always balance and forms the foundation of double-entry bookkeeping.',
      topic: 'Accounting Fundamentals'
    },
    {
      id: 'acca-q3',
      question: 'In relation to inventory valuation, what does FIFO stand for?',
      options: [
        'First In, First Out',
        'Fast In, Fast Out',
        'Final In, Final Out',
        'Frequent In, Frequent Out'
      ],
      correctAnswer: 0,
      explanation: 'FIFO (First In, First Out) is an inventory valuation method where the first items purchased are the first items sold. This method assumes that inventory purchased first is sold first.',
      topic: 'Inventory Management'
    },
    {
      id: 'acca-q4',
      question: 'Which of the following best describes working capital?',
      options: [
        'Total assets minus total liabilities',
        'Current assets minus current liabilities',
        'Fixed assets minus long-term debt',
        'Revenue minus operating expenses'
      ],
      correctAnswer: 1,
      explanation: 'Working capital is calculated as current assets minus current liabilities. It measures a company\'s short-term financial health and operational efficiency.',
      topic: 'Financial Analysis'
    },
    {
      id: 'acca-q5',
      question: 'What is the main purpose of an internal audit?',
      options: [
        'To prepare financial statements for external users',
        'To provide independent assurance on risk management and internal controls',
        'To calculate tax liabilities for the organization',
        'To determine executive compensation levels'
      ],
      correctAnswer: 1,
      explanation: 'Internal audit provides independent, objective assurance and consulting designed to add value and improve operations. It helps evaluate and improve the effectiveness of risk management, control, and governance processes.',
      topic: 'Internal Controls'
    },
    {
      id: 'acca-q6',
      question: 'Which accounting principle requires that expenses be matched with related revenues in the same accounting period?',
      options: [
        'Going concern principle',
        'Matching principle',
        'Materiality principle',
        'Consistency principle'
      ],
      correctAnswer: 1,
      explanation: 'The matching principle requires that expenses be recognized in the same period as the revenues they help to generate, providing a more accurate picture of profitability.',
      topic: 'Accounting Principles'
    },
    {
      id: 'acca-q7',
      question: 'What is the primary difference between management accounting and financial accounting?',
      options: [
        'Management accounting uses different currencies',
        'Management accounting focuses on internal users while financial accounting serves external users',
        'Management accounting only deals with future projections',
        'Management accounting requires external auditing'
      ],
      correctAnswer: 1,
      explanation: 'Management accounting provides information for internal decision-making by managers, while financial accounting provides information to external users such as investors, creditors, and regulators.',
      topic: 'Accounting Systems'
    },
    {
      id: 'acca-q8',
      question: 'In cash flow statements, which of the following would be classified as an investing activity?',
      options: [
        'Payment of dividends to shareholders',
        'Purchase of equipment',
        'Payment of interest on loans',
        'Collection of accounts receivable'
      ],
      correctAnswer: 1,
      explanation: 'Purchase of equipment is an investing activity because it involves the acquisition of long-term assets. Investing activities include purchases and sales of long-term assets and investments.',
      topic: 'Cash Flow Analysis'
    },
    {
      id: 'acca-q9',
      question: 'What does ROE (Return on Equity) measure?',
      options: [
        'How efficiently a company uses its debt',
        'How much profit a company generates for each dollar of shareholder equity',
        'How quickly a company collects its receivables',
        'How much inventory a company holds relative to sales'
      ],
      correctAnswer: 1,
      explanation: 'Return on Equity (ROE) measures how much profit a company generates for each dollar of shareholder equity. It is calculated as Net Income ÷ Average Shareholders\' Equity.',
      topic: 'Financial Ratios'
    },
    {
      id: 'acca-q10',
      question: 'Which of the following is NOT a characteristic of good corporate governance?',
      options: [
        'Transparency in financial reporting',
        'Independent board oversight',
        'Concentrated decision-making power',
        'Accountability to stakeholders'
      ],
      correctAnswer: 2,
      explanation: 'Concentrated decision-making power is NOT a characteristic of good corporate governance. Good governance requires distributed authority, checks and balances, transparency, and accountability.',
      topic: 'Corporate Governance'
    }
  ],
  'hesi-a2': [
    {
      id: 'hesi-a2-q1',
      question: 'Which part of the digestive system is primarily responsible for nutrient absorption?',
      options: [
        'Stomach',
        'Large intestine',
        'Small intestine',
        'Esophagus'
      ],
      correctAnswer: 2,
      explanation: 'The small intestine is the primary site of nutrient absorption due to its extensive surface area created by villi and microvilli, which increase the absorption capacity.',
      topic: 'Anatomy & Physiology'
    },
    {
      id: 'hesi-a2-q2',
      question: 'What is the function of the mitochondria in a cell?',
      options: [
        'Protein synthesis',
        'Energy production (ATP)',
        'DNA storage',
        'Waste disposal'
      ],
      correctAnswer: 1,
      explanation: 'Mitochondria are known as the powerhouses of the cell because they produce ATP (adenosine triphosphate), which is the main energy currency of cellular processes.',
      topic: 'Cell Biology'
    },
    {
      id: 'hesi-a2-q3',
      question: 'If a patient\'s heart rate is 72 beats per minute, how many beats occur in 5 minutes?',
      options: [
        '300 beats',
        '350 beats',
        '360 beats',
        '400 beats'
      ],
      correctAnswer: 2,
      explanation: 'To calculate total beats: 72 beats/minute × 5 minutes = 360 beats. This is a basic multiplication problem commonly found in healthcare calculations.',
      topic: 'Mathematics'
    },
    {
      id: 'hesi-a2-q4',
      question: 'Which of the following is the correct pathway of blood flow through the heart?',
      options: [
        'Right atrium → Right ventricle → Lungs → Left ventricle → Left atrium',
        'Right atrium → Right ventricle → Lungs → Left atrium → Left ventricle',
        'Left atrium → Left ventricle → Lungs → Right atrium → Right ventricle',
        'Right ventricle → Right atrium → Lungs → Left ventricle → Left atrium'
      ],
      correctAnswer: 1,
      explanation: 'Blood flows from the right atrium to right ventricle, then to the lungs for oxygenation, returns to the left atrium, then to the left ventricle, and out to the body.',
      topic: 'Cardiovascular System'
    },
    {
      id: 'hesi-a2-q5',
      question: 'What percentage of 80 is 20?',
      options: [
        '20%',
        '25%',
        '30%',
        '40%'
      ],
      correctAnswer: 1,
      explanation: 'To find what percentage 20 is of 80: (20 ÷ 80) × 100 = 0.25 × 100 = 25%.',
      topic: 'Mathematics'
    },
    {
      id: 'hesi-a2-q6',
      question: 'Which hormone regulates blood glucose levels?',
      options: [
        'Cortisol',
        'Insulin',
        'Thyroxine',
        'Adrenaline'
      ],
      correctAnswer: 1,
      explanation: 'Insulin, produced by the pancreas, is the primary hormone that regulates blood glucose levels by facilitating glucose uptake into cells.',
      topic: 'Endocrine System'
    },
    {
      id: 'hesi-a2-q7',
      question: 'In which part of the respiratory system does gas exchange primarily occur?',
      options: [
        'Trachea',
        'Bronchi',
        'Alveoli',
        'Larynx'
      ],
      correctAnswer: 2,
      explanation: 'Gas exchange occurs in the alveoli, tiny air sacs in the lungs where oxygen enters the blood and carbon dioxide is removed.',
      topic: 'Respiratory System'
    },
    {
      id: 'hesi-a2-q8',
      question: 'Convert 2.5 liters to milliliters.',
      options: [
        '250 mL',
        '2,500 mL',
        '25,000 mL',
        '0.25 mL'
      ],
      correctAnswer: 1,
      explanation: 'To convert liters to milliliters, multiply by 1,000. Therefore: 2.5 L × 1,000 = 2,500 mL.',
      topic: 'Mathematics'
    },
    {
      id: 'hesi-a2-q9',
      question: 'Which type of muscle tissue is found in the walls of internal organs?',
      options: [
        'Skeletal muscle',
        'Cardiac muscle',
        'Smooth muscle',
        'Voluntary muscle'
      ],
      correctAnswer: 2,
      explanation: 'Smooth muscle is found in the walls of internal organs such as the digestive tract, blood vessels, and bladder. It operates involuntarily.',
      topic: 'Musculoskeletal System'
    },
    {
      id: 'hesi-a2-q10',
      question: 'A nurse needs to give 0.5 mg of medication. The available dose is 0.25 mg per tablet. How many tablets should be given?',
      options: [
        '1 tablet',
        '2 tablets',
        '0.5 tablets',
        '3 tablets'
      ],
      correctAnswer: 1,
      explanation: 'To find the number of tablets: 0.5 mg needed ÷ 0.25 mg per tablet = 2 tablets.',
      topic: 'Dosage Calculations'
    }
  ],
  'ati-teas': [
    {
      id: 'teas-q1',
      question: 'Which of the following sentences contains a correctly used semicolon?',
      options: [
        'I went to the store; and bought milk.',
        'She studied hard; therefore, she passed the exam.',
        'The weather was nice; but I stayed inside.',
        'We arrived late; because of traffic.'
      ],
      correctAnswer: 1,
      explanation: 'A semicolon is correctly used before transitional words like "therefore" when connecting two independent clauses. The semicolon shows the relationship between related ideas.',
      topic: 'English Language Usage'
    },
    {
      id: 'teas-q2',
      question: 'What is the area of a rectangle with length 12 feet and width 8 feet?',
      options: [
        '40 square feet',
        '96 square feet',
        '20 square feet',
        '48 square feet'
      ],
      correctAnswer: 1,
      explanation: 'The area of a rectangle is calculated by multiplying length × width. Therefore: 12 feet × 8 feet = 96 square feet.',
      topic: 'Mathematics'
    },
    {
      id: 'teas-q3',
      question: 'Which organelle is responsible for photosynthesis in plant cells?',
      options: [
        'Mitochondria',
        'Nucleus',
        'Chloroplast',
        'Ribosome'
      ],
      correctAnswer: 2,
      explanation: 'Chloroplasts contain chlorophyll and are responsible for photosynthesis, the process by which plants convert light energy into chemical energy (glucose).',
      topic: 'Biology'
    },
    {
      id: 'teas-q4',
      question: 'Based on the following passage: "The industrial revolution transformed society in the 18th and 19th centuries. Manufacturing moved from homes to factories, leading to urbanization and changes in labor patterns." What was a primary effect of the industrial revolution?',
      options: [
        'Decreased population in cities',
        'Movement of production to factories',
        'Reduction in manufacturing',
        'Return to agricultural society'
      ],
      correctAnswer: 1,
      explanation: 'The passage states that "manufacturing moved from homes to factories," indicating that production shifted to factory settings as a primary effect of the industrial revolution.',
      topic: 'Reading Comprehension'
    },
    {
      id: 'teas-q5',
      question: 'Solve for x: 3x + 7 = 22',
      options: [
        'x = 3',
        'x = 5',
        'x = 7',
        'x = 9'
      ],
      correctAnswer: 1,
      explanation: 'To solve: 3x + 7 = 22. Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.',
      topic: 'Algebra'
    },
    {
      id: 'teas-q6',
      question: 'What is the pH of a neutral solution?',
      options: [
        '0',
        '7',
        '14',
        '1'
      ],
      correctAnswer: 1,
      explanation: 'A neutral solution has a pH of 7. Values below 7 are acidic, and values above 7 are basic (alkaline).',
      topic: 'Chemistry'
    },
    {
      id: 'teas-q7',
      question: 'Which word is spelled correctly?',
      options: [
        'Definately',
        'Definitely',
        'Definatly',
        'Definitly'
      ],
      correctAnswer: 1,
      explanation: 'The correct spelling is "definitely." This word is commonly misspelled, but remember it contains "finite" in the middle.',
      topic: 'Spelling'
    },
    {
      id: 'teas-q8',
      question: 'A recipe calls for 2/3 cup of flour. If you want to make half the recipe, how much flour do you need?',
      options: [
        '1/3 cup',
        '1/6 cup',
        '1/4 cup',
        '1/2 cup'
      ],
      correctAnswer: 0,
      explanation: 'To find half of 2/3, multiply by 1/2: (2/3) × (1/2) = 2/6 = 1/3 cup.',
      topic: 'Fractions'
    },
    {
      id: 'teas-q9',
      question: 'Which of the following is an example of a chemical change?',
      options: [
        'Ice melting',
        'Paper tearing',
        'Wood burning',
        'Water boiling'
      ],
      correctAnswer: 2,
      explanation: 'Wood burning is a chemical change because it produces new substances (ash, carbon dioxide, water vapor) and cannot be easily reversed.',
      topic: 'Physical vs Chemical Changes'
    },
    {
      id: 'teas-q10',
      question: 'What is the main idea of this passage: "Bees are essential pollinators for many crops. Without bees, agricultural production would decline significantly, affecting food supplies worldwide. Conservation efforts are crucial to protect bee populations."',
      options: [
        'Bees make honey',
        'Bees are important for agriculture and need protection',
        'Farming is difficult',
        'Food is expensive'
      ],
      correctAnswer: 1,
      explanation: 'The main idea combines the key points: bees are essential for agriculture (pollination and food production) and need conservation efforts to protect them.',
      topic: 'Main Ideas'
    }
  ],
  'nclex-rn': [
    {
      id: 'nclex-rn-q1',
      question: 'A nurse is caring for a client with heart failure. Which assessment finding indicates the condition is worsening?',
      options: [
        'Decreased urine output',
        'Improved appetite',
        'Decreased blood pressure',
        'Increased energy level'
      ],
      correctAnswer: 0,
      explanation: 'Decreased urine output indicates worsening heart failure because the kidneys receive less blood flow as cardiac output decreases, leading to fluid retention and reduced kidney function.',
      topic: 'Cardiovascular Disorders'
    },
    {
      id: 'nclex-rn-q2',
      question: 'A client is receiving warfarin (Coumadin) therapy. Which laboratory value should the nurse monitor most closely?',
      options: [
        'Hemoglobin and hematocrit',
        'Platelet count',
        'International normalized ratio (INR)',
        'White blood cell count'
      ],
      correctAnswer: 2,
      explanation: 'INR (International Normalized Ratio) is the most important lab value to monitor for clients on warfarin therapy to ensure therapeutic anticoagulation and prevent bleeding complications.',
      topic: 'Pharmacology'
    },
    {
      id: 'nclex-rn-q3',
      question: 'When administering medications, which action demonstrates the "right client" principle?',
      options: [
        'Checking the medication label three times',
        'Asking the client to state their name and date of birth',
        'Verifying the medication dosage',
        'Confirming the route of administration'
      ],
      correctAnswer: 1,
      explanation: 'Asking the client to state their name and date of birth (two patient identifiers) ensures you are giving medication to the correct client, following the "right client" principle of medication administration.',
      topic: 'Medication Safety'
    },
    {
      id: 'nclex-rn-q4',
      question: 'A client with diabetes mellitus has a blood glucose level of 350 mg/dL. Which complication should the nurse prioritize monitoring for?',
      options: [
        'Hypoglycemia',
        'Diabetic ketoacidosis (DKA)',
        'Hypotension',
        'Respiratory alkalosis'
      ],
      correctAnswer: 1,
      explanation: 'A blood glucose level of 350 mg/dL is severely elevated and puts the client at high risk for diabetic ketoacidosis (DKA), a life-threatening complication requiring immediate intervention.',
      topic: 'Endocrine Disorders'
    },
    {
      id: 'nclex-rn-q5',
      question: 'Which nursing intervention has the highest priority for a client experiencing anaphylaxis?',
      options: [
        'Obtaining vital signs',
        'Starting an IV line',
        'Maintaining airway patency',
        'Administering antihistamines'
      ],
      correctAnswer: 2,
      explanation: 'Maintaining airway patency is the highest priority using the ABC approach (Airway, Breathing, Circulation). Anaphylaxis can cause rapid airway obstruction, which is immediately life-threatening.',
      topic: 'Emergency Care'
    },
    {
      id: 'nclex-rn-q6',
      question: 'A postoperative client is at risk for deep vein thrombosis (DVT). Which intervention is most effective for prevention?',
      options: [
        'Keeping the client on bed rest',
        'Encouraging early ambulation',
        'Applying heat to the legs',
        'Massaging the calf muscles'
      ],
      correctAnswer: 1,
      explanation: 'Early ambulation is the most effective intervention to prevent DVT by promoting venous return and preventing blood stasis in the lower extremities.',
      topic: 'Perioperative Care'
    },
    {
      id: 'nclex-rn-q7',
      question: 'A nurse is teaching a client about taking digoxin. Which statement by the client indicates understanding?',
      options: [
        '"I should take my pulse before each dose."',
        '"I can stop the medication if I feel better."',
        '"I should take it with antacids to prevent stomach upset."',
        '"I need to increase my sodium intake while on this medication."'
      ],
      correctAnswer: 0,
      explanation: 'Clients taking digoxin should check their pulse before each dose because digoxin can cause bradycardia. If the pulse is below 60 bpm, they should hold the medication and contact their healthcare provider.',
      topic: 'Client Education'
    },
    {
      id: 'nclex-rn-q8',
      question: 'Which assessment finding in a newborn requires immediate nursing intervention?',
      options: [
        'Respiratory rate of 50 breaths per minute',
        'Heart rate of 110 beats per minute',
        'Central cyanosis',
        'Acrocyanosis'
      ],
      correctAnswer: 2,
      explanation: 'Central cyanosis (blueness of the trunk, lips, and mucous membranes) indicates inadequate oxygenation and requires immediate intervention. Acrocyanosis (blueness of hands and feet) is normal in newborns.',
      topic: 'Maternal-Newborn Nursing'
    },
    {
      id: 'nclex-rn-q9',
      question: 'A client with chronic kidney disease has a potassium level of 6.2 mEq/L. Which ECG change would the nurse expect to see?',
      options: [
        'Prolonged QT interval',
        'Tall, peaked T waves',
        'ST segment depression',
        'Wide QRS complex'
      ],
      correctAnswer: 1,
      explanation: 'Hyperkalemia (elevated potassium) characteristically causes tall, peaked T waves on ECG. This is an early sign of potassium toxicity that can progress to more dangerous arrhythmias.',
      topic: 'Renal Disorders'
    },
    {
      id: 'nclex-rn-q10',
      question: 'When delegating tasks to unlicensed assistive personnel (UAP), which activity is appropriate?',
      options: [
        'Assessing a client\'s pain level',
        'Teaching a diabetic client about insulin administration',
        'Assisting a stable client with ambulation',
        'Evaluating a client\'s response to pain medication'
      ],
      correctAnswer: 2,
      explanation: 'Assisting stable clients with ambulation is within the scope of practice for UAP. Assessment, teaching, and evaluation are nursing responsibilities that cannot be delegated.',
      topic: 'Management and Leadership'
    }
  ],
  'nclex-pn': [
    {
      id: 'nclex-pn-q1',
      question: 'A practical nurse is monitoring a client receiving digoxin. Which sign indicates digoxin toxicity?',
      options: [
        'Increased appetite',
        'Visual disturbances',
        'Elevated blood pressure',
        'Increased energy'
      ],
      correctAnswer: 1,
      explanation: 'Visual disturbances, including seeing yellow-green halos around objects, are classic signs of digoxin toxicity. Other signs include nausea, vomiting, and cardiac arrhythmias.',
      topic: 'Pharmacology'
    },
    {
      id: 'nclex-pn-q2',
      question: 'What is the correct technique for measuring blood pressure?',
      options: [
        'Place the cuff over clothing',
        'Position the arm below heart level',
        'Inflate the cuff to 30 mmHg above the palpated systolic pressure',
        'Deflate the cuff rapidly'
      ],
      correctAnswer: 2,
      explanation: 'The cuff should be inflated to 20-30 mmHg above the palpated systolic pressure to ensure accurate measurement and avoid missing an auscultatory gap.',
      topic: 'Basic Nursing Skills'
    },
    {
      id: 'nclex-pn-q3',
      question: 'A client with chronic obstructive pulmonary disease (COPD) should be positioned in which way to facilitate breathing?',
      options: [
        'Supine with head flat',
        'Side-lying position',
        'High Fowler\'s position',
        'Trendelenburg position'
      ],
      correctAnswer: 2,
      explanation: 'High Fowler\'s position (sitting upright at 90 degrees) allows maximum chest expansion and facilitates breathing for clients with COPD by reducing the work of breathing.',
      topic: 'Respiratory Care'
    },
    {
      id: 'nclex-pn-q4',
      question: 'When collecting a clean-catch urine specimen from a female client, the practical nurse should instruct the client to:',
      options: [
        'Collect the first few drops of urine',
        'Cleanse from back to front',
        'Collect the specimen at any time during urination',
        'Cleanse the urethral area from front to back'
      ],
      correctAnswer: 3,
      explanation: 'For females, cleansing should be done from front to back (urethral area toward the anus) to prevent contamination of the urethral area with bacteria from the anal area.',
      topic: 'Infection Control'
    },
    {
      id: 'nclex-pn-q5',
      question: 'A client is experiencing constipation. Which dietary recommendation would be most helpful?',
      options: [
        'Increase refined carbohydrates',
        'Decrease fluid intake',
        'Increase fiber intake',
        'Increase protein intake'
      ],
      correctAnswer: 2,
      explanation: 'Increasing fiber intake helps promote bowel regularity by adding bulk to stool and stimulating peristalsis. This should be combined with adequate fluid intake.',
      topic: 'Nutrition'
    },
    {
      id: 'nclex-pn-q6',
      question: 'When caring for a client with a urinary catheter, which action helps prevent urinary tract infections?',
      options: [
        'Disconnect the tubing to empty the bag',
        'Keep the drainage bag above the level of the bladder',
        'Clean the perineal area with soap and water daily',
        'Change the catheter weekly'
      ],
      correctAnswer: 2,
      explanation: 'Daily perineal care with soap and water helps prevent bacteria from ascending the catheter and causing urinary tract infections. The system should remain closed and the bag kept below bladder level.',
      topic: 'Urological Care'
    },
    {
      id: 'nclex-pn-q7',
      question: 'A client with diabetes is scheduled for surgery. The practical nurse should monitor for which preoperative complication?',
      options: [
        'Hyperglycemia',
        'Decreased blood pressure',
        'Increased appetite',
        'Improved wound healing'
      ],
      correctAnswer: 0,
      explanation: 'Clients with diabetes are at risk for hyperglycemia due to the stress response to surgery, which can impair healing and increase infection risk. Blood glucose monitoring is essential.',
      topic: 'Preoperative Care'
    },
    {
      id: 'nclex-pn-q8',
      question: 'Which observation indicates that a client is experiencing an allergic reaction to a medication?',
      options: [
        'Decreased heart rate',
        'Skin rash and itching',
        'Improved appetite',
        'Decreased blood pressure only'
      ],
      correctAnswer: 1,
      explanation: 'Skin rash and itching are common signs of an allergic reaction to medication. Other signs may include difficulty breathing, swelling, and changes in vital signs.',
      topic: 'Medication Administration'
    },
    {
      id: 'nclex-pn-q9',
      question: 'When providing care to an elderly client, which age-related change should the practical nurse consider?',
      options: [
        'Increased drug metabolism',
        'Decreased risk of falls',
        'Thinner, more fragile skin',
        'Improved immune function'
      ],
      correctAnswer: 2,
      explanation: 'Elderly clients have thinner, more fragile skin that tears easily and heals slowly. This requires gentle handling and careful skin assessment to prevent injury.',
      topic: 'Geriatric Nursing'
    },
    {
      id: 'nclex-pn-q10',
      question: 'A practical nurse is reinforcing teaching about wound care. Which statement by the client indicates understanding?',
      options: [
        '"I should clean the wound with hydrogen peroxide daily."',
        '"I will keep the wound covered and dry."',
        '"I should clean the wound with normal saline."',
        '"I need to remove the scab to promote healing."'
      ],
      correctAnswer: 2,
      explanation: 'Normal saline is the preferred cleansing solution for wounds as it is isotonic and non-toxic to healing tissues. Hydrogen peroxide can damage healthy tissue and delay healing.',
      topic: 'Wound Care'
    }
  ],
  'hesi-exit': [
    {
      id: 'hesi-exit-q1',
      question: 'A client arrives at the emergency department with chest pain and shortness of breath. Which assessment should the nurse prioritize first?',
      options: [
        'Obtain a complete health history',
        'Assess airway, breathing, and circulation (ABCs)',
        'Start an IV line for medication administration',
        'Get a 12-lead electrocardiogram (ECG)'
      ],
      correctAnswer: 1,
      explanation: 'Using the ABC priority framework, assessing airway, breathing, and circulation takes precedence in emergency situations. This ensures the client\'s immediate life-threatening conditions are identified and addressed first.',
      topic: 'Emergency Nursing'
    },
    {
      id: 'hesi-exit-q2',
      question: 'The nurse is caring for a client with acute myocardial infarction. Which assessment finding indicates cardiogenic shock?',
      options: [
        'Blood pressure 150/90 mmHg',
        'Urine output 60 mL/hour',
        'Cool, clammy skin with weak pulse',
        'Respiratory rate 16 breaths/minute'
      ],
      correctAnswer: 2,
      explanation: 'Cool, clammy skin with weak pulse indicates poor perfusion and decreased cardiac output, which are hallmark signs of cardiogenic shock following myocardial infarction.',
      topic: 'Critical Care'
    },
    {
      id: 'hesi-exit-q3',
      question: 'A nurse is preparing to administer insulin to a diabetic client. The prescription reads "10 units regular insulin subcutaneous now." Which action should the nurse take first?',
      options: [
        'Draw up the insulin in the syringe',
        'Clean the injection site',
        'Verify the client\'s identity using two identifiers',
        'Check the client\'s blood glucose level'
      ],
      correctAnswer: 2,
      explanation: 'Patient safety requires verification of client identity using two identifiers before any medication administration to ensure the right medication goes to the right client.',
      topic: 'Medication Safety'
    },
    {
      id: 'hesi-exit-q4',
      question: 'A client with chronic kidney disease has laboratory results showing: BUN 85 mg/dL, creatinine 6.8 mg/dL, potassium 6.2 mEq/L. Which intervention is the priority?',
      options: [
        'Encourage increased fluid intake',
        'Administer calcium gluconate',
        'Prepare for immediate dialysis',
        'Restrict protein intake'
      ],
      correctAnswer: 1,
      explanation: 'Hyperkalemia (K+ 6.2 mEq/L) is immediately life-threatening due to cardiac effects. Calcium gluconate stabilizes cardiac membranes and is the priority intervention.',
      topic: 'Renal Disorders'
    },
    {
      id: 'hesi-exit-q5',
      question: 'A postoperative client suddenly develops chest pain, dyspnea, and anxiety. Vital signs: BP 90/60, HR 110, RR 28. Which complication should the nurse suspect?',
      options: [
        'Pneumonia',
        'Pulmonary embolism',
        'Myocardial infarction',
        'Atelectasis'
      ],
      correctAnswer: 1,
      explanation: 'The classic triad of chest pain, dyspnea, and anxiety in a postoperative client suggests pulmonary embolism, especially with tachycardia and hypotension indicating hemodynamic compromise.',
      topic: 'Postoperative Complications'
    },
    {
      id: 'hesi-exit-q6',
      question: 'The charge nurse is making assignments. Which client should be assigned to the most experienced RN?',
      options: [
        'A stable client 2 days post-appendectomy',
        'A client with diabetes requiring routine insulin',
        'A client with sepsis requiring frequent assessment',
        'A client being discharged this afternoon'
      ],
      correctAnswer: 2,
      explanation: 'The client with sepsis requires frequent assessment and has the potential for rapid deterioration, requiring the clinical judgment and experience of the most experienced RN.',
      topic: 'Leadership and Management'
    },
    {
      id: 'hesi-exit-q7',
      question: 'A client is receiving chemotherapy. Which laboratory value indicates the greatest risk for infection?',
      options: [
        'Hemoglobin 10.2 g/dL',
        'Platelet count 150,000/mm³',
        'White blood cell count 2,000/mm³',
        'Hematocrit 30%'
      ],
      correctAnswer: 2,
      explanation: 'A white blood cell count of 2,000/mm³ indicates severe leukopenia, placing the client at high risk for infection. Normal WBC count is 4,500-11,000/mm³.',
      topic: 'Oncology Nursing'
    },
    {
      id: 'hesi-exit-q8',
      question: 'A pregnant client at 32 weeks gestation reports severe headache and visual disturbances. Blood pressure is 168/110 mmHg. Which condition should the nurse suspect?',
      options: [
        'Gestational diabetes',
        'Preeclampsia',
        'Placenta previa',
        'Urinary tract infection'
      ],
      correctAnswer: 1,
      explanation: 'Severe headache, visual disturbances, and hypertension (≥140/90) after 20 weeks gestation are classic signs of preeclampsia, a serious pregnancy complication.',
      topic: 'Maternal-Child Health'
    },
    {
      id: 'hesi-exit-q9',
      question: 'A client with bipolar disorder is taking lithium. Which finding indicates lithium toxicity?',
      options: [
        'Mild hand tremor',
        'Increased appetite',
        'Confusion and ataxia',
        'Dry mouth'
      ],
      correctAnswer: 2,
      explanation: 'Confusion and ataxia (loss of coordination) are signs of lithium toxicity. Mild hand tremor is a common side effect, but severe neurological symptoms indicate toxicity.',
      topic: 'Mental Health Nursing'
    },
    {
      id: 'hesi-exit-q10',
      question: 'The nurse is teaching parents about infant safety. Which statement indicates understanding of safe sleep practices?',
      options: [
        '"I should place my baby on his side to sleep."',
        '"I will put a pillow in the crib for comfort."',
        '"My baby should sleep on his back on a firm mattress."',
        '"I should use bumper pads to prevent injury."'
      ],
      correctAnswer: 2,
      explanation: 'The "Back to Sleep" campaign recommends placing infants on their backs on firm mattresses without pillows, bumper pads, or loose bedding to prevent SIDS.',
      topic: 'Pediatric Nursing'
    }
  ]
};

const courseNames: Record<string, string> = {
  'acca': 'ACCA',
  'hesi-a2': 'HESI A2',
  'ati-teas': 'ATI TEAS 7',
  'nclex-rn': 'NCLEX RN',
  'nclex-pn': 'NCLEX PN',
  'hesi-exit': 'HESI EXIT'
};

export default function TestPage() {
  const [match, params] = useRoute('/test/:courseId');
  const [, setLocation] = useLocation();
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const courseId = params?.courseId || '';
  const courseName = courseNames[courseId] || courseId.toUpperCase();

  useEffect(() => {
    if (match && courseId) {
      console.log('Starting test for course:', courseId);
      initializeTest(courseId);
    }
  }, [match, courseId]);

  const initializeTest = (courseId: string) => {
    const questions = mockQuestions[courseId] || [];
    
    if (questions.length === 0) {
      console.log('No questions found for course:', courseId);
      setLoading(false);
      return;
    }

    const session: TestSession = {
      courseId,
      questions,
      currentQuestion: 0,
      answers: [],
      score: 0,
      completed: false
    };

    setTestSession(session);
    setLoading(false);
  };

  const handleAnswerSubmit = (questionId: string, selectedAnswer: number, correct: boolean) => {
    if (!testSession) return;

    const newAnswer = {
      questionId,
      selectedAnswer,
      correct
    };

    const updatedAnswers = [...testSession.answers, newAnswer];
    const newScore = correct ? testSession.score + 1 : testSession.score;
    const isLastQuestion = testSession.currentQuestion === testSession.questions.length - 1;

    if (isLastQuestion) {
      setTestSession({
        ...testSession,
        answers: updatedAnswers,
        score: newScore,
        completed: false // Don't mark as completed yet, show email modal first
      });
      setShowEmailModal(true);
    } else {
      setTestSession({
        ...testSession,
        answers: updatedAnswers,
        score: newScore,
        currentQuestion: testSession.currentQuestion + 1
      });
    }
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setShowEmailModal(false);
    
    if (testSession) {
      setTestSession({
        ...testSession,
        completed: true
      });
    }
  };

  const handleRetakeTest = () => {
    console.log('Retaking test for:', courseId);
    setShowEmailModal(false);
    setUserEmail('');
    initializeTest(courseId);
  };

  const handleShareResults = (shareData: any) => {
    console.log('Sharing results:', shareData);
    // todo: implement sharing functionality
    alert('Sharing functionality will be implemented in the full version!');
  };

  const handleReturnHome = () => {
    setLocation('/');
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading test...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!testSession || testSession.questions.length === 0) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Test Not Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Sorry, the test for {courseName} is not available yet.
                </p>
                <Button onClick={handleReturnHome}>
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            {!testSession.completed ? (
              <TestQuestion
                question={testSession.questions[testSession.currentQuestion]}
                questionNumber={testSession.currentQuestion + 1}
                totalQuestions={testSession.questions.length}
                onAnswerSubmit={handleAnswerSubmit}
              />
            ) : (
              <TestResults
                courseId={testSession.courseId}
                courseName={courseName}
                score={testSession.score}
                totalQuestions={testSession.questions.length}
                answers={testSession.answers.map((answer, index) => {
                  const question = testSession.questions.find(q => q.id === answer.questionId);
                  return {
                    questionId: answer.questionId,
                    question: question?.question || '',
                    topic: question?.topic || '',
                    selectedAnswer: answer.selectedAnswer,
                    correctAnswer: question?.correctAnswer || 0,
                    correct: answer.correct,
                    explanation: question?.explanation || '',
                    options: question?.options || []
                  };
                })}
                onRetakeTest={handleRetakeTest}
                onShareResults={handleShareResults}
                onReturnHome={handleReturnHome}
              />
            )}
          </div>
        </main>
        
        <EmailCaptureModal
          isOpen={showEmailModal}
          onEmailSubmit={handleEmailSubmit}
          courseName={courseName}
          score={testSession.score}
          totalQuestions={testSession.questions.length}
        />
      </div>
    </ThemeProvider>
  );
}