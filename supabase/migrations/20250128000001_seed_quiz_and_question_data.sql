-- Insert dummy quiz data
INSERT INTO public.quizzes (id, title, description)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'JavaScript Fundamentals', 'Test your knowledge of JavaScript basics'),
  ('550e8400-e29b-41d4-a716-446655440002', 'React Basics', 'Fundamentals of React framework'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Web Development Trivia', 'General web development knowledge');

-- Insert dummy questions for JavaScript Fundamentals quiz
INSERT INTO public.questions (quiz_id, question, options, correct_answer, explanation, order_index)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'What is the correct way to declare a variable in JavaScript?',
    '["variable myVar", "let myVar", "var: myVar", "myVar := value"]'::jsonb,
    1,
    'In modern JavaScript, ''let'' is the correct way to declare a variable. It provides block-scoping and prevents common errors associated with ''var''.',
    0
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Which method is used to add an element to the end of an array?',
    '["push()", "add()", "append()", "insert()"]'::jsonb,
    0,
    'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'What does ''NaN'' stand for in JavaScript?',
    '["Null and Nothing", "Not a Number", "No Available Name", "Negative and Null"]'::jsonb,
    1,
    'NaN stands for ''Not a Number'' and is a special value that represents an invalid or undefined numerical result.',
    2
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Which operator is used for strict equality in JavaScript?',
    '["==", "===", "=", "equals()"]'::jsonb,
    1,
    'The === operator checks for strict equality, comparing both value and type. It''s generally preferred over == which performs type coercion.',
    3
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'What is the output of: typeof []?',
    '["array", "object", "list", "undefined"]'::jsonb,
    1,
    'In JavaScript, arrays are actually objects. The typeof operator returns ''object'' for arrays. To check if something is an array, use Array.isArray().',
    4
  );

-- Insert dummy questions for React Basics quiz
INSERT INTO public.questions (quiz_id, question, options, correct_answer, explanation, order_index)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'What is a React Hook?',
    '["A way to catch errors", "A function that lets you use state and lifecycle features", "A component lifecycle method", "A third-party library"]'::jsonb,
    1,
    'Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8.',
    0
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Which hook is used for side effects in React?',
    '["useState", "useEffect", "useContext", "useReducer"]'::jsonb,
    1,
    'useEffect is the hook for performing side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'What does JSX stand for?',
    '["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java XML"]'::jsonb,
    0,
    'JSX stands for JavaScript XML. It''s a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript.',
    2
  );

-- Insert dummy questions for Web Development Trivia quiz
INSERT INTO public.questions (quiz_id, question, options, correct_answer, explanation, order_index)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'What does CSS stand for?',
    '["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"]'::jsonb,
    1,
    'CSS stands for Cascading Style Sheets. It''s used to describe the presentation of a document written in HTML or XML.',
    0
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Which HTTP method is used to retrieve data?',
    '["POST", "PUT", "GET", "DELETE"]'::jsonb,
    2,
    'GET is the HTTP method used to retrieve data from a server. It should only retrieve data and should not have any side effects.',
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'What is the default port for HTTP?',
    '["443", "8080", "3000", "80"]'::jsonb,
    3,
    'Port 80 is the default port for HTTP connections. Port 443 is for HTTPS, while 8080 and 3000 are commonly used for development servers.',
    2
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'What does HTML stand for?',
    '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]'::jsonb,
    0,
    'HTML stands for Hyper Text Markup Language. It''s the standard markup language for creating web pages and web applications.',
    3
  );
