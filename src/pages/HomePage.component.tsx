import Stack from '@mui/material/Stack';
import { Button } from 'components/Button';
import { H3, H1, B1 } from 'components/Typography';
import { useAuth } from 'lib/hooks';
import { useCallback } from 'react';
import Particles from 'react-particles';
import { useNavigate } from 'react-router-dom';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

export const HomePage = () => {
	const navigate = useNavigate();
	const { signInII, loadingII, user } = useAuth();

	const particlesInit = useCallback(async (engine: Engine) => {
		// you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		await loadSlim(engine);
	}, []);

	return (
		<Stack direction="column" mt={10} spacing={10}>
			<Stack component="section" spacing={2} sx={{ zIndex: 1 }}>
				<H1 fontSize={56}>Circuitz, where Data Flows Freely and Securely</H1>
				<div>
					<Button
						color="primary"
						variant="contained"
						onClick={() => {
							if (user) {
								return navigate('/circuits');
							}

							signInII();
						}}
						loading={loadingII}
					>
						Start here with Internet Identity
					</Button>
				</div>
			</Stack>
			<Stack component="section" spacing={2} sx={{ zIndex: 1 }}>
				<H1>Discover the Future of Integration</H1>
				<B1
					sx={{
						p: 1,
						backgroundColor: theme => theme.palette.secondary.main,
						color: theme => theme.palette.secondary.contrastText
					}}
				>
					The future of integration is here, built exclusively on the Internet Computer. Seamlessly connect, process,
					and automate data flows between canisters, unlocking a new realm of possibilities for decentralized
					applications.
				</B1>
			</Stack>
			<Stack component="section" spacing={2} sx={{ zIndex: 1 }}>
				<H1>How it works</H1>
				<Stack
					direction="column"
					spacing={1}
					sx={{
						p: 1,
						backgroundColor: theme => theme.palette.secondary.main,
						color: theme => theme.palette.secondary.contrastText
					}}
				>
					<H3 fontWeight="bold">Initiate a Node</H3>
					<B1>
						Begin your integration journey by directing data into a Node. Acting as the primary gateway, this Node
						securely receives data straight from the source canister, ensuring a smooth and efficient intake process.
					</B1>
				</Stack>
				<Stack
					direction="column"
					spacing={1}
					sx={{
						p: 1,
						backgroundColor: theme => theme.palette.secondary.main,
						color: theme => theme.palette.secondary.contrastText
					}}
				>
					<H3 fontWeight="bold">Harness the Power of Nodes</H3>
					<B1>
						Dive deeper into the customization realm with our advanced nodes. Tailor your data processing by employing
						our versatile nodes, whether you're aiming to map, transform, or filter. Each node is designed to offer a
						unique function, ensuring your data is processed exactly how you envision.
					</B1>
				</Stack>
				<Stack
					direction="column"
					spacing={1}
					sx={{
						p: 1,
						backgroundColor: theme => theme.palette.secondary.main,
						color: theme => theme.palette.secondary.contrastText
					}}
				>
					<H3 fontWeight="bold">Seamless Output</H3>
					<B1>
						Conclude your data's journey by directing it to a designated canister. After undergoing the specified Node
						processes, your refined data is channeled to its final destination, ensuring accurate and timely delivery.
					</B1>
				</Stack>
				<div>
					<Button
						color="primary"
						variant="contained"
						onClick={() => {
							if (user) {
								return navigate('/circuits');
							}

							signInII();
						}}
					>
						Create your Circuit
					</Button>
				</div>
			</Stack>
			<Particles
				id="tsparticles"
				init={particlesInit}
				options={{
					particles: {
						number: {
							value: 80,
							density: {
								enable: true,
								value_area: 800
							}
						},
						color: {
							value: '#B87333' // Copper color to match circuit theme
						},
						shape: {
							type: 'circle',
							stroke: {
								width: 0,
								color: '#000000'
							},
							polygon: {
								nb_sides: 5
							}
						},
						opacity: {
							value: 0.5,
							random: false,
							anim: {
								enable: false,
								speed: 1,
								opacity_min: 0.1,
								sync: false
							}
						},
						size: {
							value: 3,
							random: true,
							anim: {
								enable: false,
								speed: 40,
								size_min: 0.1,
								sync: false
							}
						},
						line_linked: {
							enable: true,
							distance: 150,
							color: '#4C635D', // PCB green to match circuit theme
							opacity: 0.4,
							width: 1
						},
						move: {
							enable: true,
							speed: 2,
							direction: 'none',
							random: false,
							straight: false,
							out_mode: 'out',
							bounce: false,
							attract: {
								enable: false,
								rotateX: 600,
								rotateY: 1200
							}
						}
					},
					interactivity: {
						detect_on: 'canvas',
						events: {
							onhover: {
								enable: true,
								mode: 'grab'
							},
							onclick: {
								enable: true,
								mode: 'push'
							},
							resize: true
						},
						modes: {
							grab: {
								distance: 140,
								line_linked: {
									opacity: 1
								}
							},
							bubble: {
								distance: 400,
								size: 40,
								duration: 2,
								opacity: 8,
								speed: 3
							},
							repulse: {
								distance: 200,
								duration: 0.4
							},
							push: {
								particles_nb: 4
							},
							remove: {
								particles_nb: 2
							}
						}
					},
					retina_detect: true
				}}
			/>
		</Stack>
	);
};
