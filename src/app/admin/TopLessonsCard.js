import React from "react";

export default function TopLessonsCard(props) {
  const lessonName = props.lessonName
  const subtext = props.subtext
	const value = props.value
	const rank = props.rank
	const hasSubtext = props.hasSubtext

	return (
		<div className="flex flex-col items-stretch justify-center gap-3 rounded-md shadow-xl shadow-slate-800 bg-slate-500 py-5 px-3 relative">
			<h1 className="text-6xl font-bold text-slate-400 absolute right-8">{rank}</h1>
			<h3 className="text-2xl font-thin text-slate-100">{lessonName}</h3>
			<p className="text-md font-bold text-slate-100">{hasSubtext ? subtext + ": " + value : ""}</p>
		</div>
	)
}