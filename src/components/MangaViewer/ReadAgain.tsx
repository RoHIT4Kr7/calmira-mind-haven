import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const ReadAgain = ({ isStoryFinished, restartStory }: any) =>
  isStoryFinished ? (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
      <Button variant="outline" onClick={restartStory} className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
        <RotateCcw className="mr-2" /> Read Again
      </Button>
    </motion.div>
  ) : null;

export default ReadAgain;
