import StackArray from "./pages/StackArray.jsx";
import SortingLab from "./pages/SortingLab.jsx";
import DSALabIndex from "./pages/DSALabIndex.jsx";
import StackLab from "./pages/StackLab.jsx";
import QueueLab from "./pages/Queue.jsx";
import LinkedListLab from "./pages/LinkedList.jsx";
import SearchingLab from "./pages/labs/searching/SearchingLab.jsx";
import DTSPLabIndex from "./pages/DTSPLabIndex.jsx";
import DTSPDFTIDFT from "./pages/DTSPDFTIDFT.jsx";
import DTSPDFTProperties from "./pages/DTSPDFTProperties.jsx";
import DTSPLinearCircularConvolution from "./pages/DTSPLinearCircularConvolution.jsx";
import DTSPPoleZeroAnalysis from "./pages/DTSPPoleZeroAnalysis.jsx";
import DTSPLinearPhaseFIRAnalysis from "./pages/DTSPLinearPhaseFIRAnalysis.jsx";
import DSDLabIndex from "./pages/DSDLabIndex.jsx";
import DSDLogicGates from "./pages/DSDLogicGates.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import DSDAdders from "./pages/DSDAdders.jsx";
import DSDMultiplexer from "./pages/DSDMultiplexer.jsx";
import DSDFlipFlops from "./pages/DSDFlipFlops.jsx";
import DSDPropagationDelay from "./pages/DSDPropagationDelay.jsx";
import DVLSILabIndex from "./pages/DVLSILabIndex.jsx";
import DVLSIMOSFETCharacteristics from "./pages/DVLSIMOSFETCharacteristics.jsx";
import DVLSILambdaRulesMicrowind from "./pages/DVLSILambdaRulesMicrowind.jsx";
import DVLSICMOSInverterSimulation from "./pages/DVLSICMOSInverterSimulation.jsx";
import DVLSICMOSInverterLayout from "./pages/DVLSICMOSInverterLayout.jsx";
import DVLSICMOSNORGate from "./pages/DVLSICMOSNORGate.jsx";
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
  return user ? children : <Navigate to="/login" />;
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
        {/* DTSP Lab index and experiments (frontend-only for now) */}
        <Route path="/labs/dtsp" element={<ProtectedRoute><DTSPLabIndex /></ProtectedRoute>} />
        <Route path="/labs/dtsp/pole-zero-analysis" element={<ProtectedRoute><DTSPPoleZeroAnalysis /></ProtectedRoute>} />
        <Route path="/labs/dtsp/dft-idft" element={<ProtectedRoute><DTSPDFTIDFT /></ProtectedRoute>} />
        <Route path="/labs/dtsp/dft-properties" element={<ProtectedRoute><DTSPDFTProperties /></ProtectedRoute>} />
        <Route
          path="/labs/dtsp/linear-convolution-using-circular-convolution"
          element={<ProtectedRoute><DTSPLinearCircularConvolution /></ProtectedRoute>}
        />
        <Route
          path="/labs/dtsp/linear-phase-fir-analysis"
          element={<ProtectedRoute><DTSPLinearPhaseFIRAnalysis /></ProtectedRoute>}
        />
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
        <Route path="/labs/dvlsi/mosfet-characteristics" element={<ProtectedRoute><DVLSIMOSFETCharacteristics /></ProtectedRoute>} />
        <Route path="/labs/dvlsi/lambda-rules-microwind" element={<ProtectedRoute><DVLSILambdaRulesMicrowind /></ProtectedRoute>} />
        <Route path="/labs/dvlsi/cmos-inverter-simulation" element={<ProtectedRoute><DVLSICMOSInverterSimulation /></ProtectedRoute>} />
        <Route path="/labs/dvlsi/cmos-inverter-layout" element={<ProtectedRoute><DVLSICMOSInverterLayout /></ProtectedRoute>} />
        <Route path="/labs/dvlsi/cmos-nor-gate" element={<ProtectedRoute><DVLSICMOSNORGate /></ProtectedRoute>} />
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
