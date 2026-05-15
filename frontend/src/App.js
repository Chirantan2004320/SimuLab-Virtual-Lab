import StackArray from "./pages/StackArray.jsx";
import SortingLab from "./pages/SortingLab.jsx";
import DSALabIndex from "./pages/DSALabIndex.jsx";
import StackLab from "./pages/StackLab.jsx";
import QueueLab from "./pages/Queue.jsx";
import LinkedListLab from "./pages/LinkedList.jsx";
import SearchingLab from "./pages/labs/searching/SearchingLab.jsx";
import RecursionLab from "./pages/labs/Recursion/RecursionLab.jsx";
import TreeLab from "./pages/labs/Tree/TreeLab.jsx";
import HeapLab from "./pages/labs/heap/HeapLab.jsx";
import GraphLab from "./pages/labs/graph/GraphLab.jsx";
import HashTableLab from "./pages/labs/hash-table/HashTableLab.jsx";
import DBMSLabIndex from "./pages/DBMSLabIndex.jsx";
import DBMSSQLBasicsLab from "./pages/labs/DBMS/sql-basics/DBMSSQLBasics.jsx";
import DBMSJoinsLab from "./pages/labs/DBMS/sqljoins/DBMSJoinsLab.jsx";
import DBMSNormalizationLab from "./pages/labs/DBMS/normalization/DBMSNormalizationLab.jsx";
import DBMSTransactionsLab from "./pages/labs/DBMS/transactions/DBMSTransactionsLab.jsx";
import DBMSIndexingLab from "./pages/labs/DBMS/indexing/DBMSIndexingLab.jsx";
import DBMSConcurrencyLab from "./pages/labs/DBMS/concurrency/DBMSConcurrencyLab.jsx";
import DBMSERModelingLab from "./pages/labs/DBMS/ERModelling/DBMSERModelingLab.jsx";
import DBMSQueryOptimizationLab from "./pages/labs/DBMS/QueryOptimization/DBMSQueryOptimizationLab.jsx";
import OSLabIndex from "./pages/OSLabIndex.jsx";
import CPUSchedulingLab from "./pages/labs/OS/cpu-schedulling/CPUSchedulingLab.jsx";
import ProcessSynchronizationLab from "./pages/labs/OS/processsyncronization/ProcessSynchronizationLab.jsx";
import DeadlockLab from "./pages/labs/OS/deadlock/DeadlockLab.jsx";
import PageReplacementLab from "./pages/labs/OS/pagereplacement/PageReplacementLab.jsx";
import DiskSchedulingLab from "./pages/labs/OS/diskscheduling/DiskSchedulingLab.jsx";
import PagingLab from "./pages/labs/OS/memory-management/PagingLab.jsx";
import DTSPLabIndex from "./pages/DTSPLabIndex.jsx";
import DTSPDFTIDFT from "./pages/labs/DTSP/DFTIDFT/DTSPDFTIDFTLab.jsx";
import DTSPDFTPropertiesLab from "./pages/labs/DTSP/DFTProperties/DTSPDFTPropertiesLab.jsx";
import DTSPLinearCircularConvolutionLab from "./pages/labs/DTSP/DTSPLinearCircularConvolution/DTSPLinearCircularConvolutionLab.jsx";
import DTSPPoleZeroAnalysisLab from "./pages/labs/DTSP/PoleZeroAnalysis/DTSPPoleZeroAnalysisLab.jsx";
import DTSPLinearPhaseFIRLab from "./pages/labs/DTSP/LinearPhaseFIR/DTSPLinearPhaseFIRLab.jsx";
import DTSPAliasingLab from "./pages/labs/DTSP/SamplingAliasing/DTSPAliasingLab.jsx";
import DTSPFFTvsDFTLab from "./pages/labs/DTSP/FFTvsDFT/DTSPFFTvsDFTLab.jsx";
import DTSPFilterDesignLab from "./pages/labs/DTSP/DTSPFilterDesign/DTSPFilterDesignLab.jsx";
import DTSPIIRFilterDesignLab from "./pages/labs/DTSP/IIRFilterDesign/DTSPIIRFilterDesignLab.jsx";
import DTSPWindowingTechniquesLab from "./pages/labs/DTSP/WindowingTechniques/DTSPWindowingTechniquesLab.jsx";
import DSDLabIndex from "./pages/DSDLabIndex.jsx";
import DSDLogicGatesLab from "./pages/labs/DSD/LogicGates/DSDLogicGatesLab.jsx";
import AIAssistant from "./components/ai-assistant/AIAssistant.jsx";
import DSDAddersLab from "./pages/labs/DSD/Adders/DSDAddersLab.jsx";
import DSDMultiplexerLab from "./pages/labs/DSD/Multiplexer/DSDMultiplexerLab.jsx";
import DSDFlipFlopsLab from "./pages/labs/DSD/FlipFlops/DSDFlipFlopsLab.jsx";
import DSDPropagationDelayLab from "./pages/labs/DSD/PropagationDelay/DSDPropagationDelayLab.jsx";
import DSDDecoderEncoderLab from "./pages/labs/DSD/DecoderEncoder/DSDDecoderEncoderLab.jsx";
import DSDComparatorLab from "./pages/labs/DSD/Comparator/DSDComparatorLab.jsx";
import DSDCounterLab from "./pages/labs/DSD/Counter/DSDCounterLab.jsx";
import DVLSILabIndex from "./pages/DVLSILabIndex.jsx";
import DVLSIMOSFETLab from "./pages/labs/DVLSI/MOSFETCharacteristics/DVLSIMOSFETLab.jsx";
import DVLSILambdaRulesMicrowindLab from "./pages/labs/DVLSI/LambdaRulesMicrowind/DVLSILambdaRulesMicrowindLab.jsx";
import DVLSICMOSInverterSimulationLab from "./pages/labs/DVLSI/CMOSInverterSimulation/DVLSICMOSInverterSimulationLab.jsx";
import DVLSICMOSInverterLayoutLab from "./pages/labs/DVLSI/CMOSInverterLayout/DVLSICMOSInverterLayoutLab.jsx";
import DVLSICMOSNORGateLab from "./pages/labs/DVLSI/CMOSNORGate/DVLSICMOSNORGateLab.jsx";
import DVLSICMOSNANDGateLab from "./pages/labs/DVLSI/CMOSNANDGate/DVLSICMOSNANDGateLab.jsx";
import DVLSITransmissionGateLab from "./pages/labs/DVLSI/TransmissionGate/DVLSITransmissionGateLab.jsx";
import DVLSIRingOscillatorLab from "./pages/labs/DVLSI/RingOscillator/DVLSIRingOscillatorLab.jsx";
import DVLSISRAMCellLab from "./pages/labs/DVLSI/SRAMCell/DVLSISRAMCellLab.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
//import { useAuth } from './context/AuthContext';
import MicrocontrollerLabIndex from "./pages/MicrocontrollerLabIndex.jsx";
import GPIOLEDLab from "./pages/labs/Microcontrollers/GPIO/GPIOLEDLab.jsx";
import ButtonInputLab from "./pages/labs/Microcontrollers/ButtonInput/ButtonInputLab.jsx";
import LEDBlinkLab from "./pages/labs/Microcontrollers/LEDBlink/LEDBlinkLab.jsx";
import TrafficLightLab from "./pages/labs/Microcontrollers/TrafficLight/TrafficLightLab.jsx";
import SevenSegmentLab from "./pages/labs/Microcontrollers/SevenSegment/SevenSegmentLab.jsx";
import PWMLedLab from "./pages/labs/Microcontrollers/PWMLED/PWMLedLab.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import FacultyStudents from "./pages/FacultyStudents.jsx";
import FacultyQuizManager from "./pages/FacultyQuizManager.jsx";
import FacultyCodingManager from "./pages/FacultyCodingManager.jsx";
import FacultyNotices from "./pages/FacultyNotices.jsx";
import FacultyEvaluation from "./pages/FacultyEvaluation.jsx";
import StudentNotices from "./pages/StudentNotices.jsx";
import StudentGrades from "./pages/StudentGrades.jsx";
import StudentFeedback from "./pages/StudentFeedback.jsx";
import StudentQuiz from "./pages/StudentQuiz.jsx";
import StudentCoding from "./pages/StudentCoding.jsx";

// Public Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Labs from "./pages/Labs.jsx";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

// Protected Pages
//import Dashboard from "./pages/Dashboard.jsx";


// Lab Pages
// ...existing code...



function AppContent() {
  const location = useLocation();
  // Read Institute Mode from environment variable
  const instituteMode = process.env.REACT_APP_INSTITUTE_MODE === 'true';

  // Extract current page and algorithm from URL/path
  const getCurrentContext = () => {
    const path = location.pathname;
    if (path.includes('/labs/dsa')) {
      return { page: 'labs/dsa', algorithm: null }; // Will be determined by component state
    }
    if (path.includes('/labs/stack')) {
      return { page: 'labs/stack', algorithm: null };
    }
    if (path.includes('/labs/dtsp')) {
      return { page: 'labs/dtsp', algorithm: null };
    }
    if (path.includes('/labs/dsd')) {
      return { page: 'labs/dsd', algorithm: null };
    }
    if (path.includes('/labs/dvlsi')) {
      return { page: 'labs/dvlsi', algorithm: null };
    }
    if (path.includes("/labs/dbms")) {
      return { page: "labs/dbms", algorithm: null };
    }
    if (path === '/') {
      return { page: 'home', algorithm: null };
    }
    return { page: path.substring(1), algorithm: null };
  };

  const { page } = getCurrentContext();

  return (
    <>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home instituteMode={instituteMode} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 🔒 Protected Routes */}
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute
      allowedRoles={["student"]}
    >
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
       <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/faculty/dashboard"
  element={
    <ProtectedRoute allowedRoles={["faculty", "admin"]}>
      <FacultyDashboard />
    </ProtectedRoute>
  }
/>

        {/* Stack Array Lab Route */}
        <Route path="/labs/stack" element={<ProtectedRoute><StackArray /></ProtectedRoute>} />
        {/* DSA Lab index and experiments */}
        <Route path="/labs/dsa" element={<ProtectedRoute><DSALabIndex /></ProtectedRoute>} />
        <Route path="/labs/dsa/sorting" element={<ProtectedRoute><SortingLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/queue" element={<ProtectedRoute><QueueLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/linked-list" element={<ProtectedRoute><LinkedListLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/stack" element={<ProtectedRoute><StackLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/searching" element={<ProtectedRoute><SearchingLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/recursion" element={<ProtectedRoute><RecursionLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/tree" element={<ProtectedRoute><TreeLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/heap" element={<ProtectedRoute><HeapLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/graph" element={<ProtectedRoute><GraphLab /></ProtectedRoute>} />
        <Route path="/labs/dsa/hash-table" element={<ProtectedRoute><HashTableLab /></ProtectedRoute>} />

        {/* DBMS Lab index and experiments (frontend-only for now) */}
        <Route path="/labs/dbms" element={<ProtectedRoute><DBMSLabIndex /></ProtectedRoute>} />
        <Route path="/labs/dbms/sql-basics" element={<ProtectedRoute><DBMSSQLBasicsLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/joins" element={<ProtectedRoute><DBMSJoinsLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/normalization" element={<ProtectedRoute><DBMSNormalizationLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/transactions" element={<ProtectedRoute><DBMSTransactionsLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/indexing" element={<ProtectedRoute><DBMSIndexingLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/concurrency" element={<ProtectedRoute><DBMSConcurrencyLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/er-modeling" element={<ProtectedRoute><DBMSERModelingLab /></ProtectedRoute>} />
        <Route path="/labs/dbms/query-optimization" element={<ProtectedRoute><DBMSQueryOptimizationLab /></ProtectedRoute>} />

        {/* OS Lab index and experiments */}
        <Route path="/labs/os" element={<ProtectedRoute><OSLabIndex /></ProtectedRoute>} />
        <Route path="/labs/os/cpu-scheduling" element={<ProtectedRoute><CPUSchedulingLab /></ProtectedRoute>} />  
        <Route path="/labs/os/process-synchronization" element={<ProtectedRoute><ProcessSynchronizationLab /></ProtectedRoute>} />
        <Route path="/labs/os/deadlock" element={<ProtectedRoute><DeadlockLab /></ProtectedRoute>} />
        <Route path="/labs/os/page-replacement" element={<ProtectedRoute><PageReplacementLab /></ProtectedRoute>} />
        <Route path="/labs/os/disk-scheduling" element={<ProtectedRoute><DiskSchedulingLab /></ProtectedRoute>} />
        <Route path="/labs/os/memory-management" element={<ProtectedRoute><PagingLab /></ProtectedRoute>} />

        {/* DTSP Lab index and experiments (frontend-only for now) */}
        <Route path="/labs/dtsp" element={<ProtectedRoute><DTSPLabIndex /></ProtectedRoute>} />
        <Route path="/labs/dtsp/pole-zero-analysis" element={<ProtectedRoute><DTSPPoleZeroAnalysisLab /></ProtectedRoute>}/>
        <Route path="/labs/dtsp/dft-idft" element={<ProtectedRoute><DTSPDFTIDFT /></ProtectedRoute>} />
        <Route path="/labs/dtsp/dft-properties"element={<ProtectedRoute><DTSPDFTPropertiesLab /></ProtectedRoute>}/>
        <Route path="/labs/dtsp/linear-convolution-using-circular-convolution" element={<ProtectedRoute><DTSPLinearCircularConvolutionLab /></ProtectedRoute>}/>
        <Route path="/labs/dtsp/linear-phase-fir-analysis" element={<ProtectedRoute><DTSPLinearPhaseFIRLab /></ProtectedRoute>}/>
        <Route path="/labs/dtsp/sampling-aliasing" element={<ProtectedRoute><DTSPAliasingLab /></ProtectedRoute>}/>
        <Route path="/labs/dtsp/fft-vs-dft" element={<ProtectedRoute><DTSPFFTvsDFTLab /></ProtectedRoute>}/>
        <Route path="/labs/dtsp/filter-design" element={<ProtectedRoute><DTSPFilterDesignLab /></ProtectedRoute>} />
        <Route path="/labs/dtsp/iir-filter-design" element={<ProtectedRoute><DTSPIIRFilterDesignLab /></ProtectedRoute>} />
        <Route path="/labs/dtsp/windowing-techniques" element={<ProtectedRoute><DTSPWindowingTechniquesLab /></ProtectedRoute>} />

        {/* DSD Lab index (frontend-only for now) */}
        <Route path="/labs/dsd" element={<ProtectedRoute><DSDLabIndex /></ProtectedRoute>} />
        <Route path="/labs/dsd/logic-gates" element={<ProtectedRoute><DSDLogicGatesLab /></ProtectedRoute>}/>        
        <Route path="/labs/dsd/adders" element={<ProtectedRoute><DSDAddersLab /></ProtectedRoute>}/>       
         <Route path="/labs/dsd/multiplexer" element={<ProtectedRoute><DSDMultiplexerLab /></ProtectedRoute>}/>
        <Route path="/labs/dsd/flip-flops" element={<ProtectedRoute><DSDFlipFlopsLab /></ProtectedRoute>}/>        
        <Route path="/labs/dsd/propagation-delay" element={<ProtectedRoute><DSDPropagationDelayLab /></ProtectedRoute>}/>
        <Route path="/labs/dsd/decoder-encoder" element={<ProtectedRoute><DSDDecoderEncoderLab /></ProtectedRoute>}/>
        <Route path="/labs/dsd/comparator" element={<ProtectedRoute><DSDComparatorLab /></ProtectedRoute>}/>
        <Route path="/labs/dsd/counter" element={<ProtectedRoute><DSDCounterLab /></ProtectedRoute>}/>


        {/* DVLSI Lab index and experiments */}
        <Route path="/labs/dvlsi" element={<ProtectedRoute><DVLSILabIndex /></ProtectedRoute>} />
        <Route path="/labs/dvlsi/mosfet-characteristics" element={<ProtectedRoute><DVLSIMOSFETLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/lambda-rules-microwind" element={<ProtectedRoute><DVLSILambdaRulesMicrowindLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/cmos-inverter-simulation" element={<ProtectedRoute><DVLSICMOSInverterSimulationLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/cmos-inverter-layout" element={<ProtectedRoute><DVLSICMOSInverterLayoutLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/cmos-nor-gate" element={<ProtectedRoute><DVLSICMOSNORGateLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/cmos-nand-gate" element={<ProtectedRoute><DVLSICMOSNANDGateLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/transmission-gate" element={<ProtectedRoute><DVLSITransmissionGateLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/ring-oscillator" element={<ProtectedRoute><DVLSIRingOscillatorLab /></ProtectedRoute>}/>
        <Route path="/labs/dvlsi/sram-cell" element={<ProtectedRoute><DVLSISRAMCellLab /></ProtectedRoute>}/>
        

          {/* Microcontroller Lab index and experiments */}
          <Route path="/labs/microcontroller" element={<ProtectedRoute><MicrocontrollerLabIndex /></ProtectedRoute>}/>
          <Route path="/labs/microcontroller/gpio-led"element={<ProtectedRoute><GPIOLEDLab /></ProtectedRoute>}/>
          <Route path="/labs/microcontroller/button-input" element={<ProtectedRoute><ButtonInputLab /></ProtectedRoute>} />
          <Route path="/labs/microcontroller/led-blink" element={<ProtectedRoute><LEDBlinkLab /></ProtectedRoute>} />
          <Route path="/labs/microcontroller/traffic-light" element={<ProtectedRoute><TrafficLightLab /></ProtectedRoute>} />
          <Route path="/labs/microcontroller/seven-segment" element={<ProtectedRoute><SevenSegmentLab /></ProtectedRoute>} />
          <Route path="/labs/microcontroller/pwm-led" element={<ProtectedRoute><PWMLedLab /></ProtectedRoute>} />


          <Route path="/faculty/students" element={<FacultyStudents />}/>
          <Route path="/faculty/quizzes" element={<FacultyQuizManager />}/>
          <Route path="/faculty/coding" element={<FacultyCodingManager />}/>
          <Route path="/faculty/notices" element={<FacultyNotices />}/>
          <Route path="/faculty/evaluation" element={<FacultyEvaluation />}/>

          <Route
  path="/student/notices"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentNotices />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/grades"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentGrades />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/feedback"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentFeedback />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/quizzes"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentQuiz />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/coding"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentCoding />
    </ProtectedRoute>
  }
/>


        {/* 🚫 Fallback Route (optional) */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />

            <Route
  path="/labs"
  element={
    <ProtectedRoute>
      <Labs />
    </ProtectedRoute>
  }
/>


      </Routes>


      {/* AI Assistant - Available on all pages */}
      <AIAssistant currentPage={page} instituteMode={instituteMode} />

    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
