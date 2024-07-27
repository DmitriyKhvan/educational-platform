
import { TailSpin } from "react-loader-spinner";

const ReactLoader = ({ className }: {
    className?: string;
}) => {
	return (
		<TailSpin
			color="#00BFFF"
			wrapperClass={`
        fixed
        bg-slate-400/20 
        z-[10000] 
        top-0 
        left-0 
        bottom-0
        right-0
        flex 
        items-center 
        justify-center
        ${className}
        `}
			height={80}
			width={80}
		/>
	);
};

export default ReactLoader;
