import React from "react";

export default function LessonProgressCard(props) {
	const name = props.name
	const progress = props.progress

	// Calculate the conic gradient based on progress
	const conicGradient = `conic-gradient(#1E293B ${progress * 3.6}deg, #F1F5F9 0deg)`;

	return (
		<div className="flex flex-col items-stretch justify-center gap-3 rounded-md shadow-xl shadow-slate-800 bg-slate-500 p-5">
			<div className="circular-progress" style={{ background: conicGradient }}>
				<span className="progress-value">{Math.round(progress * 100)/100}%</span>
			</div>
			<h2 className="text-md text-center text-slate-100">{name}</h2>
		</div>
	)
}