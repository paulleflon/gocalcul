import Latex from 'react-latex';
import {useRef, useState} from "react";

export default function Game({gameState, setGameState, onEnd}) {
	const [step, setStep] = useState('guessing');
	const inputRef = useRef(null);
	const [inputVal, setInputVal] = useState('');
	const onInputChange = (e) => {
		setInputVal(e.target.value);
	}
	const getCorrection = async () => {
		setStep('loading');
		const res = await fetch('/api/getCorrection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({formula: gameState.formulas[gameState.viewing]})
		});
		const data = await res.json();
		const {corrections, replies} = gameState;
		replies.push(inputRef.current.value);
		corrections.push(data.correction);
		setGameState({...gameState, corrections, replies});
		setStep('feedback');
	}
	const setFeedback = async (f) => {
		const feedbacks = gameState.feedback;
		feedbacks.push(f);
		fetch('/api/sendAttempt', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				viewing: gameState.viewing + 1,
				amount: gameState.formulas.length,
				formula: gameState.formulas[gameState.viewing],
				reply: gameState.replies[gameState.viewing],
				correction: gameState.corrections[gameState.viewing],
				feedback: f
			})
		});
		setGameState({...gameState, feedbacks, viewing: gameState.viewing + 1});
		if (gameState.viewing === gameState.formulas.length - 1)
			onEnd();
		setStep('guessing');
		inputRef.current.value = '';
		setInputVal('');
	}
	return (
		<div className='flex flex-col items-center gap-8'>
			<div id='progress' className='relative bg-white w-full text-blue-500 text-2xl font-bold text-center py-3'>
				<div>{gameState.viewing + 1} / {gameState.formulas.length}</div>
				<div className='absolute left-0 bottom-0 h-1 bg-blue-500 transition-all duration-200'
				     style={{width: `${(gameState.viewing + 1)/gameState.formulas.length * 100}%`}}>

				</div>
			</div>
			<div className='text-2xl font-bold flex-1 inline-block'>Développer, réduire et ordonner</div>
			<div className='text-lg text-center flex-1 inline-block overflow-x-auto max-w-full'>
				<Latex>{'$' + gameState.formulas[gameState.viewing] + '$'}</Latex>
			</div>
			<div className='relative w-9/12'>
				<input
					type='text'
					placeholder='Ta réponse... (utilise ^ pour représenter une puissance. ex: x^4)'
					className='appearance-none w-full h-16 p-4 bg-white
								rounded text-black font-bold placeholder:font-normal text-center
								placeholder:text-left disabled:bg-gray-200 disabled:cursor-not-allowed'
					disabled={step !== 'guessing'}
					onChange={onInputChange}
					ref={inputRef}
				/>
				<div className='text-lg mt-4 text-center'>
					<Latex>{'$'+inputVal+'$'}</Latex>
				</div>
			</div>
			{
				step === 'guessing' &&
					<button onClick={getCorrection}>Afficher la correction</button>
			}
			{
				step === 'loading' && 'Chargement...'
			}
			{
				step === 'feedback' &&
				<>
					<div className='font-xl'>La réponse était :</div>
					<div className='text-lg text-center flex-1 inline-block max-w-full overflow-x-auto'>
						<Latex>{'$' + gameState.corrections[gameState.viewing] + '$'}</Latex>
					</div>
					<div>As-tu bien répondu ?</div>
					<div className='flex gap-4'>
						<button color='#db3027' onClick={() => setFeedback('wrong')}>Non</button>
						<button color='#f5cc14' onClick={() => setFeedback('almost')}>Non, mais pas loin</button>
						<button color='#22e051' onClick={() => setFeedback('right')}>Oui</button>
					</div>
					<button onClick={() => setFeedback('incorrect')}>La correction est incorrecte.</button>
				</>
			}
		</div>
	);
}