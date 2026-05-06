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