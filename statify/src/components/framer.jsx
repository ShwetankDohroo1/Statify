import { motion } from 'framer-motion';

const SwitchButton = () => (
    <motion.div className="switchButtonOuter" onClick={toggleForm} initial={{ x: 0 }} animate={{ x: isSignup ? "50%" : 0 }} transition={{ duration: 0.3 }}>
        <div className="switchButtonInner"></div>
    </motion.div>
);
