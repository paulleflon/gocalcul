import {useEffect, useState} from "react";

export default function Button({children, value, field, choices, onClick}) {
	const [active, setActive] = useState(choices[field] === value);
	useEffect(() => {
		setActive(choices[field] === value);
	}, [choices, value, field]);
	return (
		<button
			active={active.toString()}
			onClick={() => onClick(field, value)}
		>
			{children}
		</button>
	)
}