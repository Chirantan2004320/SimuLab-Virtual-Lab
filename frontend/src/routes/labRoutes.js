// routes/labRoutes.js

// 🔹 DSA
import DSALabIndex from "../pages/labs/dsa/index/DSALabIndex.jsx";

import SortingLab from "../pages/labs/dsa/sorting/SortingLab.jsx";

import StackArray from "../pages/labs/dsa/stack/StackArray.jsx";
import StackLab from "../pages/labs/dsa/stack/StackLab.jsx";

import Queue from "../pages/labs/dsa/queue/Queue.jsx";
import LinkedList from "../pages/labs/dsa/linked-list/LinkedList.jsx";

// ✅ NEW DSA IMPORTS
import SearchingLab from "../pages/labs/dsa/searching/SearchingLab.jsx";
import RecursionLab from "../pages/labs/dsa/Recursion/RecursionLab.jsx";
import TreeLab from "../pages/labs/dsa/Tree/TreeLab.jsx";
import HeapLab from "../pages/labs/dsa/heap/HeapLab.jsx";
import GraphLab from "../pages/labs/dsa/graph/GraphLab.jsx";
import HashTableLab from "../pages/labs/dsa/hash-table/HashTableLab.jsx";

// 🔹 DSP
import DTSPLabIndex from "../pages/labs/dsp/index/DTSPLabIndex.jsx";
import DTSPDFTIDFT from "../pages/labs/dsp/dft-idft/DTSPDFTIDFT.jsx";
import DTSPDFTProperties from "../pages/labs/dsp/dft-properties/DTSPDFTProperties.jsx";
import DTSPPoleZeroAnalysis from "../pages/labs/dsp/pole-zero-analysis/DTSPPoleZeroAnalysis.jsx";
import DTSPLinearCircularConvolution from "../pages/labs/dsp/linear-convolution/DTSPLinearCircularConvolution.jsx";
import DTSPLinearPhaseFIRAnalysis from "../pages/labs/dsp/fir-analysis/DTSPLinearPhaseFIRAnalysis.jsx";

// 🔹 DSD
import DSDLabIndex from "../pages/labs/dsd/index/DSDLabIndex.jsx";
import DSDLogicGates from "../pages/labs/dsd/logic-gates/DSDLogicGates.jsx";
import DSDAdders from "../pages/labs/dsd/adders/DSDAdders.jsx";
import DSDMultiplexer from "../pages/labs/dsd/multiplexer/DSDMultiplexer.jsx";
import DSDFlipFlops from "../pages/labs/dsd/flip-flops/DSDFlipFlops.jsx";
import DSDPropagationDelay from "../pages/labs/dsd/propagation-delay/DSDPropagationDelay.jsx";

// 🔹 DVLSI
import DVLSILabIndex from "../pages/labs/dvlsi/index/DVLSILabIndex.jsx";
import DVLSIMOSFETCharacteristics from "../pages/labs/dvlsi/mosfet-characteristics/DVLSIMOSFETCharacteristics.jsx";
import DVLSILambdaRulesMicrowind from "../pages/labs/dvlsi/lambda-rules/DVLSILambdaRulesMicrowind.jsx";
import DVLSICMOSInverterSimulation from "../pages/labs/dvlsi/inverter-simulation/DVLSICMOSInverterSimulation.jsx";
import DVLSICMOSInverterLayout from "../pages/labs/dvlsi/inverter-layout/DVLSICMOSInverterLayout.jsx";
import DVLSICMOSNORGate from "../pages/labs/dvlsi/nor-gate/DVLSICMOSNORGate.jsx";

// 🔹 DBMS
import DBMSLabIndex from "../pages/labs/DBMS/index/DBMSLabIndex.jsx";

// 🔹 OS
import OSLabIndex from "../pages/labs/OS/index/OSLabIndex.jsx";

export const labRoutes = [
  // 🔹 DSA
  { path: "/labs/dsa", element: <DSALabIndex /> },
  { path: "/labs/dsa/sorting", element: <SortingLab /> },
  { path: "/labs/dsa/stack", element: <StackLab /> },
  { path: "/labs/dsa/stack-array", element: <StackArray /> },
  { path: "/labs/dsa/queue", element: <Queue /> },
  { path: "/labs/dsa/linked-list", element: <LinkedList /> },

  // ✅ NEW DSA ROUTES
  { path: "/labs/dsa/searching", element: <SearchingLab /> },
  { path: "/labs/dsa/recursion", element: <RecursionLab /> },
  { path: "/labs/dsa/tree", element: <TreeLab /> },
  { path: "/labs/dsa/heap", element: <HeapLab /> },
  { path: "/labs/dsa/graph", element: <GraphLab /> },
  { path: "/labs/dsa/hash-table", element: <HashTableLab /> },

  // 🔹 DSP
  { path: "/labs/dsp", element: <DTSPLabIndex /> },
  { path: "/labs/dsp/dft-idft", element: <DTSPDFTIDFT /> },
  { path: "/labs/dsp/dft-properties", element: <DTSPDFTProperties /> },
  { path: "/labs/dsp/pole-zero-analysis", element: <DTSPPoleZeroAnalysis /> },
  { path: "/labs/dsp/linear-convolution", element: <DTSPLinearCircularConvolution /> },
  { path: "/labs/dsp/fir-analysis", element: <DTSPLinearPhaseFIRAnalysis /> },

  // 🔹 DSD
  { path: "/labs/dsd", element: <DSDLabIndex /> },
  { path: "/labs/dsd/logic-gates", element: <DSDLogicGates /> },
  { path: "/labs/dsd/adders", element: <DSDAdders /> },
  { path: "/labs/dsd/multiplexer", element: <DSDMultiplexer /> },
  { path: "/labs/dsd/flip-flops", element: <DSDFlipFlops /> },
  { path: "/labs/dsd/propagation-delay", element: <DSDPropagationDelay /> },

  // 🔹 DVLSI
  { path: "/labs/dvlsi", element: <DVLSILabIndex /> },
  { path: "/labs/dvlsi/mosfet-characteristics", element: <DVLSIMOSFETCharacteristics /> },
  { path: "/labs/dvlsi/lambda-rules", element: <DVLSILambdaRulesMicrowind /> },
  { path: "/labs/dvlsi/inverter-simulation", element: <DVLSICMOSInverterSimulation /> },
  { path: "/labs/dvlsi/inverter-layout", element: <DVLSICMOSInverterLayout /> },
  { path: "/labs/dvlsi/nor-gate", element: <DVLSICMOSNORGate /> },

  // 🔹 DBMS
  { path: "/labs/dbms", element: <DBMSLabIndex /> },

  // 🔹 OS
  { path: "/labs/os", element: <OSLabIndex /> },
];