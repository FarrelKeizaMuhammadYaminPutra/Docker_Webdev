import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-900 tw-via-red-600 tw-to-red-800 tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
			{/* Simple Loading Spinner */}
			<motion.div
				className="tw-w-16 tw-h-16 tw-border-4 tw-border-t-4 tw-border-t-red-500 tw-border-red-200 tw-rounded-full"
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;

