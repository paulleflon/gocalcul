import Latex from "react-latex";
import {useEffect, useState} from "react";

export default function ResultsModal({gameState,displayed, onClose}) {
	const [grade, setGrade] = useState(0);
	const translate = {
		'wrong': 'Faux',
		'almost': 'Presque',
		'right': 'Correct',
		'incorrect': 'Correction\\ incorrecte'
	};
	useEffect(() => {
		let g = 0;
		let max = 0;
		for (const f of gameState.feedback) {
			if (f !== 'incorrect')
				max+=1;
			if (f === 'almost')
				g+=0.5;
			if (f === 'right')
				g+=1
		}
		setGrade((g/max * 20));
	}, [gameState, grade]);
	return (
		<div className='top-0 left-0 fixed w-full h-full bg-black/50 backdrop-blur-sm items-center justify-center'
		     style={{display: displayed ? 'flex' : 'none'}}
		>
			<div className='bg-white text-black rounded-lg w-3/5 h-4/5 overflow-y-auto p-4'>
				<div className='text-center text-4xl font-bold'>Récap'</div>
				<div className='flex flex-col gap-4'>
				{
					gameState.formulas.map((f, i) => (
						<div className='border-b border-b-gray-200 pb-4' key={i}>
							<div className='font-bold text-xl'>Exercice {i + 1}</div>
							<div className='flex gap-2 flex-wrap justify-start items-start'>
								<div>
									<div className='text-lg'>
										Énoncé :
									</div>
									<div className='text-xs bg-gray-100 p-1'>
										<Latex>{'$' + f + '$'}</Latex>
									</div>
								</div>
								<div>
									<div className='text-lg'>
										Ta réponse :
									</div>
									<div className='text-xs bg-gray-100 p-1'>
										<Latex>{'$' + gameState.replies[i] + '$'}</Latex>
									</div>
								</div>
								<div>
									<div className='text-lg'>
										Correction :
									</div>
									<div className='text-xs bg-gray-100 p-1'>
										<Latex>{'$' + gameState.corrections[i] + '$'}</Latex>
									</div>
								</div>
									<div>
									<div className='text-lg'>
										Évaluation :
									</div>
									<div className='text-xs bg-gray-100 p-1'>
										<Latex>{'$'+ translate[gameState.feedback[i]]+'$'}</Latex>
									</div>
								</div>
							</div>
						</div>
					))
				}
				</div>
				<div className='font-bold text-center text-4xl my-4'>
					{grade.toFixed(2)}/20
				</div>
				<button onClick={onClose} className='my-4 text-black border-black hover:bg-black hover:text-white flex-1'>Fermer</button>
			</div>
		</div>
	);
}