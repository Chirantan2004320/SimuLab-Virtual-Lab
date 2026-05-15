CREATE DATABASE IF NOT EXISTS simulab_db;
USE simulab_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS labs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lab_id INT NOT NULL,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_lab_experiment (lab_id, slug),
  FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  experiment_id INT NOT NULL,
  status ENUM('started', 'completed') DEFAULT 'started',
  points INT DEFAULT 0,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_experiment (user_id, experiment_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  experiment_id INT NOT NULL,
  correct_answers INT NOT NULL,
  total_questions INT NOT NULL,
  score_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coding_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  experiment_id INT NOT NULL,
  problem_title VARCHAR(200),
  language VARCHAR(50),
  code MEDIUMTEXT,
  result ENUM('passed', 'failed', 'attempted') DEFAULT 'attempted',
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE
);

INSERT IGNORE INTO labs (slug, title, description) VALUES
('dsa', 'Data Structures Lab', 'Interactive data structures and algorithms experiments'),
('dbms', 'Database Management Systems', 'SQL, normalization, transactions, and indexing experiments'),
('os', 'Operating Systems Lab', 'CPU scheduling, memory management, and process synchronization'),
('dtsp', 'Digital Signal Processing', 'Signals, transforms, convolution, and filter design'),
('dsd', 'Digital System Design', 'Logic gates, adders, multiplexers, counters, and flip-flops'),
('dvlsi', 'Digital VLSI Design', 'MOSFET, CMOS, layout, SRAM, and circuit-level experiments'),
('microcontroller', 'Microcontroller Lab', 'GPIO, LED, PWM, traffic light, and embedded experiments');

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'sorting', 'Sorting Algorithms', 'Bubble sort, selection sort, and sorting comparison'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'queue', 'Queue', 'Queue operations and visualization'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'linked-list', 'Linked List', 'Singly linked list operations'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'stack', 'Stack', 'Stack push, pop, and peek operations'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'sql-basics', 'SQL Basics', 'Basic SQL commands and queries'
FROM labs WHERE slug = 'dbms';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'sampling-aliasing', 'Sampling and Aliasing', 'Sampling theorem and aliasing visualization'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'logic-gates', 'Logic Gates', 'AND, OR, NOT, NAND, NOR, XOR gates'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'mosfet-characteristics', 'MOSFET Characteristics', 'MOSFET IV characteristics and regions'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'searching', 'Searching Algorithms', 'Linear search and binary search experiments'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'recursion', 'Recursion', 'Recursive problem solving and call stack visualization'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'tree', 'Trees', 'Tree traversal and hierarchical data structures'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'heap', 'Heap', 'Min heap, max heap, and priority queue operations'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'graph', 'Graph', 'Graph representation, traversal, and path algorithms'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'hash-table', 'Hash Table', 'Hashing, collision handling, and lookup operations'
FROM labs WHERE slug = 'dsa';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'concurrency', 'Concurrency Control', 'Lost update, dirty read, locking, and transaction isolation'
FROM labs WHERE slug = 'dbms';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'er-modeling', 'ER Modelling', 'Entities, attributes, relationships, ER diagrams, and relational mapping'
FROM labs
WHERE slug = 'dbms';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'query-optimization', 'Query Optimization', 'Selection pushdown, projection pushdown, and join order optimization'
FROM labs WHERE slug = 'dbms';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'dft-idft', 'DFT and IDFT', 'Discrete Fourier Transform, magnitude, phase, and reconstruction'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'dft-properties', 'DFT Properties', 'Linearity, time shift, and frequency shift properties of DFT'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'fft-vs-dft', 'FFT vs DFT', 'Comparison of direct DFT and FFT operation count and spectrum'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'linear-circular-convolution', 'Linear and Circular Convolution', 'Linear convolution, circular convolution, wrap-around effect, and zero padding'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'pole-zero-analysis', 'Pole-Zero Analysis', 'Zeros, poles, z-plane location, unit circle, and stability analysis'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'linear-phase-fir', 'Linear Phase FIR Filter', 'FIR symmetry, linear phase type classification, magnitude and phase response'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'fir-filter-design', 'FIR Filter Design', 'Low-pass and high-pass FIR filter design using window method'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'iir-filter-design', 'IIR Filter Design', 'Butterworth IIR filter design, order, cutoff, response, poles, and stability'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'windowing-techniques', 'Windowing Techniques', 'Rectangular, Hanning, Hamming, Blackman, and Bartlett windows for FIR filter design'
FROM labs WHERE slug = 'dtsp';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'half-full-adder', 'Half Adder and Full Adder', 'Binary addition using half adder and full adder circuits'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'multiplexer', 'Multiplexer', '4-to-1 multiplexer selection, truth table, circuit, quiz, and coding practice'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'flip-flops', 'Flip-Flops', 'SR, D, JK, and T flip-flop state transition experiments'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'propagation-delay', 'Propagation Delay', 'Logic gate propagation delay and timing analysis'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'decoder-encoder', 'Decoder and Encoder', '2-to-4 decoder and 4-to-2 encoder logic conversion'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'comparator', 'Comparator', '1-bit binary comparator with greater, equal, and less outputs'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'counter', 'Counter', '2-bit binary counter with clock pulses and reset operation'
FROM labs WHERE slug = 'dsd';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'lambda-rules-microwind', 'Lambda Rules and Microwind', 'Scalable VLSI lambda layout rules and DRC validation'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'cmos-inverter-simulation', 'CMOS Inverter Simulation', 'VTC, transient response, and delay concepts'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'cmos-inverter-layout', 'CMOS Inverter Layout', 'Layout-level inverter design'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'cmos-nor-gate', 'CMOS NOR Gate', '2-input CMOS NOR gate behavior'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'cmos-nand-gate', 'CMOS NAND Gate', '2-input CMOS NAND gate behavior'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'transmission-gate', 'Transmission Gate', 'Transmission gate switching experiment'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'ring-oscillator', 'Ring Oscillator', 'Oscillation through inverter feedback'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'sram-cell', 'SRAM Cell Basics', 'Basic SRAM cell read/write storage'
FROM labs WHERE slug = 'dvlsi';

INSERT IGNORE INTO experiments (
  lab_id,
  slug,
  title,
  description
)
SELECT
  id,
  'gpio-led',
  'GPIO LED Control',
  'Control an LED using GPIO digital output logic'
FROM labs
WHERE slug = 'microcontroller';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'button-input', 'Button Input',
'Push button digital input experiment'
FROM labs
WHERE slug = 'microcontroller';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'led-blink', 'LED Blink',
'LED blinking using delay timing'
FROM labs
WHERE slug = 'microcontroller';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'traffic-light', 'Traffic Light Controller',
'Traffic signal control using GPIO'
FROM labs
WHERE slug = 'microcontroller';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'seven-segment', '7 Segment Display',
'7 segment display interfacing experiment'
FROM labs
WHERE slug = 'microcontroller';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id, 'pwm-led', 'PWM LED Brightness',
'PWM based LED brightness control'
FROM labs
WHERE slug = 'microcontroller';

ALTER TABLE users
MODIFY COLUMN role ENUM(
  'student',
  'faculty',
  'admin'
) DEFAULT 'student';

CREATE TABLE faculty_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,

  faculty_id INT NOT NULL,

  student_id INT NOT NULL,

  experiment_id INT NOT NULL,

  feedback TEXT,

  marks INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (faculty_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  FOREIGN KEY (student_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  FOREIGN KEY (experiment_id)
    REFERENCES experiments(id)
    ON DELETE CASCADE
);

CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,

  title VARCHAR(200),

  content TEXT,

  created_by INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

UPDATE users
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE';

UPDATE users
SET role = 'faculty'
WHERE email = 'faculty@college.com';

CREATE TABLE feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT,
  student_id INT,
  lab VARCHAR(100),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT,
  student_id INT,
  experiment VARCHAR(255),
  marks INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT,
  title VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,

  faculty_id INT,

  lab VARCHAR(100),

  experiment VARCHAR(255),

  question TEXT,

  option_a VARCHAR(255),
  option_b VARCHAR(255),
  option_c VARCHAR(255),
  option_d VARCHAR(255),

  correct_answer VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coding_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,

  faculty_id INT,

  lab VARCHAR(100),

  experiment VARCHAR(255),

  title VARCHAR(255),

  problem_statement TEXT,

  input_format TEXT,

  output_format TEXT,

  constraints_text TEXT,

  sample_input TEXT,

  sample_output TEXT,

  difficulty ENUM(
    'easy',
    'medium',
    'hard'
  ) DEFAULT 'easy',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coding_test_cases (
  id INT PRIMARY KEY AUTO_INCREMENT,

  question_id INT,

  input_data TEXT,

  expected_output TEXT,

  is_hidden BOOLEAN DEFAULT TRUE,

  FOREIGN KEY (question_id)
    REFERENCES coding_questions(id)
    ON DELETE CASCADE
);

ALTER TABLE coding_submissions
CHANGE experiment_id coding_question_id INT(11) NOT NULL;

ALTER TABLE coding_submissions
ADD COLUMN passed_test_cases INT DEFAULT 0,
ADD COLUMN total_test_cases INT DEFAULT 0,
ADD COLUMN execution_time VARCHAR(50),
ADD COLUMN memory_used VARCHAR(50),
ADD COLUMN verdict VARCHAR(100);

INSERT INTO coding_test_cases
(
  question_id,
  input_data,
  expected_output
)
VALUES
(
  1,
  '5',
  '[5]'
);

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id,
'cpu-scheduling',
'CPU Scheduling Lab',
'FCFS, SJF, Round Robin, and Priority CPU scheduling visualization'
FROM labs
WHERE slug = 'os';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id,
'process-synchronization',
'Process Synchronization',
'Critical section, semaphores, mutexes, producer-consumer, and synchronization problems'
FROM labs
WHERE slug = 'os';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id,
'deadlock',
'Deadlock Lab',
'Deadlock detection, prevention, avoidance, and Banker’s Algorithm simulation'
FROM labs
WHERE slug = 'os';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id,
'page-replacement',
'Page Replacement Lab',
'FIFO, LRU, and Optimal page replacement algorithm visualization'
FROM labs
WHERE slug = 'os';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id,
'disk-scheduling',
'Disk Scheduling Lab',
'FCFS, SSTF, SCAN, and C-SCAN disk scheduling algorithms'
FROM labs
WHERE slug = 'os';

INSERT IGNORE INTO experiments (lab_id, slug, title, description)
SELECT id,
'memory-management',
'Paging and Memory Management',
'Paging, segmentation, virtual memory, and address translation'
FROM labs
WHERE slug = 'os';

INSERT INTO coding_questions
(
  faculty_id,
  lab,
  experiment,
  title,
  problem_statement,
  input_format,
  output_format,
  constraints_text,
  sample_input,
  sample_output,
  difficulty
)
VALUES
(
  1,
  'OS',
  'CPU Scheduling',
  'FCFS Waiting Time Calculation',

  'Given processes with arrival time and burst time, calculate waiting time and turnaround time using FCFS scheduling.',

  'Processes with Arrival Time and Burst Time',

  'Waiting Time and Turnaround Time table',

  'Use FCFS scheduling order',

  'P1 AT=0 BT=4\nP2 AT=1 BT=3',

  'WT: P1=0 P2=3\nTAT: P1=4 P2=6',

  'easy'
),

(
  1,
  'OS',
  'CPU Scheduling',
  'Round Robin Scheduling',

  'Find execution order and waiting time using Round Robin scheduling.',

  'Processes and Time Quantum',

  'Execution order and waiting time',

  'Use RR scheduling with given quantum',

  'Quantum=2\nP1 BT=5\nP2 BT=3',

  'Execution: P1 P2 P1 P2 P1',

  'medium'
),

(
  1,
  'OS',
  'CPU Scheduling',
  'SJF Scheduling Analysis',

  'Determine process execution order using Shortest Job First scheduling.',

  'Processes with Burst Time',

  'Execution sequence',

  'Non-preemptive SJF',

  'P1 BT=6\nP2 BT=2\nP3 BT=4',

  'Execution Order: P2 P3 P1',

  'easy'
),

(
  1,
  'OS',
  'CPU Scheduling',
  'Priority Scheduling',

  'Find process scheduling order using Priority Scheduling.',

  'Processes with Priority',

  'Priority execution order',

  'Lower number means higher priority',

  'P1 Priority=2\nP2 Priority=1',

  'Execution Order: P2 P1',

  'medium'
);




INSERT INTO coding_test_cases
(
  question_id,
  input_data,
  expected_output,
  is_hidden
)
VALUES

(
  1,
  'FCFS Input',
  'WT: P1=0 P2=3',
  FALSE
),

(
  2,
  'RR Input',
  'Execution: P1 P2 P1 P2 P1',
  FALSE
),

(
  3,
  'SJF Input',
  'Execution Order: P2 P3 P1',
  FALSE
),

(
  4,
  'Priority Input',
  'Execution Order: P2 P1',
  FALSE
);