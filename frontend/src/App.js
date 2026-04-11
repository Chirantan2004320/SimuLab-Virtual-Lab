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
import DTSPLabIndex from "./pages/DTSPLabIndex.jsx";
import DTSPDFTIDFT from "./pages/labs/DTSP/DFTIDFT/DTSPDFTIDFTLab.jsx";
import DTSPDFTPropertiesLab from "./pages/labs/DTSP/DFTProperties/DTSPDFTPropertiesLab.jsx";
import DTSPLinearCircularConvolutionLab from "./pages/labs/DTSP/DTSPLinearCircularConvolution/DTSPLinearCircularConvolutionLab.jsx";
import DTSPPoleZeroAnalysisLab from "./pages/labs/DTSP/PoleZeroAnalysis/DTSPPoleZeroAnalysisLab.jsx";
import DTSPLinearPhaseFIRLab from "./pages/labs/DTSP/LinearPhaseFIR/DTSPLinearPhaseFIRLab.jsx";
import DTSPAliasingLab from "./pages/labs/DTSP/SamplingAliasing/DTSPAliasingLab.jsx";
import DTSPFFTvsDFTLab from "./pages/labs/DTSP/FFTvsDFT/DTSPFFTvsDFTLab.jsx";
import DTSPFilterDesignLab from "./pages/labs/DTSP/DTSPFilterDesign/DTSPFilterDesignLab.jsx";
import DSDLabIndex from "./pages/DSDLabIndex.jsx";
import DSDLogicGates from "./pages/DSDLogicGates.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import DSDAdders from "./pages/DSDAdders.jsx";
import DSDMultiplexer from "./pages/DSDMultiplexer.jsx";
import DSDFlipFlops from "./pages/DSDFlipFlops.jsx";
import DSDPropagationDelay from "./pages/DSDPropagationDelay.jsx";
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
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Pages
import Dashboard from "./pages/Dashboard.jsx";


// Lab Pages
// ...existing code...

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};


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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard instituteMode={instituteMode} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><div /></ProtectedRoute>} />

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


        {/* DTSP Lab index and experiments (frontend-only for now) */}
        <Route path="/labs/dtsp" element={<ProtectedRoute><DTSPLabIndex /></ProtectedRoute>} />
        <Route
          path="/labs/dtsp/pole-zero-analysis"
          element={
          <ProtectedRoute>
          <DTSPPoleZeroAnalysisLab />
          </ProtectedRoute>
       }
      />
        <Route path="/labs/dtsp/dft-idft" element={<ProtectedRoute><DTSPDFTIDFT /></ProtectedRoute>} />
        <Route
         path="/labs/dtsp/dft-properties"
        element={
        <ProtectedRoute>
        <DTSPDFTPropertiesLab />
        </ProtectedRoute>
        }
      />
        <Route
          path="/labs/dtsp/linear-convolution-using-circular-convolution"
          element={<ProtectedRoute><DTSPLinearCircularConvolutionLab /></ProtectedRoute>}
        />
        <Route
          path="/labs/dtsp/linear-phase-fir-analysis"
          element={
          <ProtectedRoute>
          <DTSPLinearPhaseFIRLab />
          </ProtectedRoute>
          }
        />

        <Route
  path="/labs/dtsp/sampling-aliasing"
  element={
    <ProtectedRoute>
      <DTSPAliasingLab />
    </ProtectedRoute>
  }
/>

<Route
  path="/labs/dtsp/fft-vs-dft"
  element={
    <ProtectedRoute>
      <DTSPFFTvsDFTLab />
    </ProtectedRoute>
  }
/>

<Route path="/labs/dtsp/filter-design" element={<ProtectedRoute><DTSPFilterDesignLab /></ProtectedRoute>} />

        {/* DSD Lab index (frontend-only for now) */}
        <Route path="/labs/dsd" element={<ProtectedRoute><DSDLabIndex /></ProtectedRoute>} />
        <Route
          path="/labs/dsd/logic-gates"
          element={<ProtectedRoute><DSDLogicGates /></ProtectedRoute>}
        />
        <Route
          path="/labs/dsd/adders"
          element={<ProtectedRoute><DSDAdders /></ProtectedRoute>}
        />
        <Route
          path="/labs/dsd/multiplexer"
          element={<ProtectedRoute><DSDMultiplexer /></ProtectedRoute>}
        />
        <Route
          path="/labs/dsd/flip-flops"
          element={<ProtectedRoute><DSDFlipFlops /></ProtectedRoute>}
        />
        <Route
          path="/labs/dsd/propagation-delay"
          element={<ProtectedRoute><DSDPropagationDelay /></ProtectedRoute>}
        />
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
        
        {/* 🚫 Fallback Route (optional) */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
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
