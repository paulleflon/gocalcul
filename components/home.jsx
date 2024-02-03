import ChoiceButton from "./Button";

export default function Home({choices, setChoices, onStart}) {
	const onClick = (field, value) => {
		setChoices({
			...choices,
			[field]: value
		});
	}
	return (
		<div>
			<div className='flex flex-col items-center gap-8'>
				<div className='text-xl text-center'>Choisis ta difficulté</div>
				<div className='flex flex-row justify-center my-2 gap-4'>
					<ChoiceButton choices={choices} field='difficulty' value='EASY' onClick={onClick}>Facile</ChoiceButton>
					<ChoiceButton choices={choices} field='difficulty' value='MEDIUM' onClick={onClick}>Moyen</ChoiceButton>
					<ChoiceButton choices={choices} field='difficulty' value='HARD' onClick={onClick}>Difficile</ChoiceButton>
					<ChoiceButton choices={choices} field='difficulty' value='INSANE' onClick={onClick}>Extrême</ChoiceButton>
				</div>
				<div className='text-xl text-center'>Choisis le nombre de calculs</div>
				<div className='flex flex-row gap-4'>
					<ChoiceButton choices={choices} field='amount' value={3} onClick={onClick}>3</ChoiceButton>
					<ChoiceButton choices={choices} field='amount' value={5} onClick={onClick}>5</ChoiceButton>
					<ChoiceButton choices={choices} field='amount' value={10} onClick={onClick}>10</ChoiceButton>
				</div>
				<button className='text-4xl' onClick={onStart}>C&apos;est parti !</button>
			</div>
		</div>
	);
}
