import Head from 'next/head'
import Home from '../components/home';
import {useState} from "react";
import Game from "../components/Game";
import ResultsModal from "../components/ResultsModal";
import {DIFFICULTIES, generateFormula} from '../lib/formula';

export default function Index()	{
	const [choices, setChoices] = useState({
		amount: null,
		difficulty: null
	});
	const [scene, setScene] = useState('home');
	const [loading, setLoading] = useState(false);
	const [gameState, setGameState] = useState({
		formulas: [],
		replies: [],
		corrections: [],
		feedback: [],
		viewing: 0
	});
	const [showResults, setShowResults] = useState(false);
	const onStart = async () => {
		for (const c of Object.values(choices)) {
			if (c === null)
				return;
		}
		setLoading(true);
		let formulas = [];
		for (let i = 0; i < choices.amount; i++) {
			formulas.push(generateFormula(DIFFICULTIES[choices.difficulty]));
		}
		setGameState({formulas, replies: [], corrections: [], feedback: [], viewing: 0 });
		setLoading(false);
		setScene('game');
	}
	const onEnd = () => {
		setScene('home');
		setGameState({...gameState, viewing: 0});
		setShowResults(true);
		setChoices({amount: null, difficulty: null});
	}

	return (
		<div>
			<Head>
				<title>GoCalcul</title>
				<meta name='description' content='Generated	by create next app'/>
				<link rel='icon' href='/favicon.ico'/>
				<link
					href='//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css'
					rel='stylesheet'
				/>
			</Head>
			<div className='ribbon'>ALPHA</div>
			<div className='text-6xl text-center font-bold my-8'>GoCalcul</div>
			{
				scene === 'home' &&
				<Home choices={choices} setChoices={setChoices} onStart={onStart} />
			}
			{
				loading && 'Génération automatique des exercices...'
			}
			{
				scene === 'game' &&
				<Game onEnd={onEnd} gameState={gameState} setGameState={setGameState} />
			}
			<ResultsModal
				gameState={gameState}
				displayed={showResults}
				formulas={gameState.formulas}
				corrections={gameState.corrections}
				replies={gameState.replies}
				feedback={gameState.feedback}
				onClose={() => setShowResults(false)}
			/>
		</div>
	);
}
