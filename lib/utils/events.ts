export const subscribe = (eventName: any, listener: (this: Document, ev: any) => any) => {
	document.addEventListener(eventName, listener);
};

export const unsubscribe = (eventName: any, listener: (this: Document, ev: any) => any) => {
	document.removeEventListener(eventName, listener);
};

export const emit = (eventName: string, data: Record<string, any>) => {
	const event = new CustomEvent(eventName, { detail: data });
	document.dispatchEvent(event);
};
