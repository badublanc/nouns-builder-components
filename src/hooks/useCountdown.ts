import { useEffect, useState } from 'react';

const zeroUnits = {
	hours: 0,
	minutes: 0,
	seconds: 0,
};

type Props = {
	deadline: number;
};

const useCountdown = ({ deadline }: Props) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [units, setUnits] = useState(zeroUnits);
	const [countdown, setCountdown] = useState<string>('00h 00m 00s');

	useEffect(() => {
		const interval = setInterval(() => {
			const secondsLeft = deadline - Math.floor(Date.now() / 1000);
			if (secondsLeft >= 0) {
				if (!isActive) setIsActive(true);
				const timer = parseTimeLeft(secondsLeft);
				setCountdown(timer.countdown);
				setUnits(timer.units);
			} else {
				clearInterval(interval);
				setCountdown('00h 00m 00s');
				setIsActive(false);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
			setIsActive(false);
		};
	}, [deadline]);

	return { countdown, isActive, units };
};

const parseTimeLeft = (seconds: number) => {
	if (seconds < 0) {
		return {
			countdown: '00h 00m 00s',
			units: zeroUnits,
		};
	}

	let formatted = '';

	const hoursRemaining = seconds / 60 / 60;
	const minutesRemaining = (hoursRemaining % 1) * 60;
	const secondsRemaining = (minutesRemaining % 1) * 60;

	const relative = {
		hours: Math.floor(hoursRemaining),
		minutes: Math.floor(minutesRemaining),
		seconds: Math.floor(secondsRemaining),
	};

	const padUnit = (unit: number) => unit.toString().padStart(2, '0');

	if (relative.hours) formatted += padUnit(relative.hours) + 'h ';
	else formatted += '00h ';

	if (relative.minutes) formatted += padUnit(relative.minutes) + 'm ';
	else formatted += '00m ';

	if (relative.seconds) formatted += padUnit(relative.seconds) + 's';
	else formatted += '00s';

	return { countdown: formatted, units: relative };
};

export default useCountdown;
