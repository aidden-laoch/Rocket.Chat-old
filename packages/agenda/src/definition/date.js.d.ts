declare module 'date.js' {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	function date(str: string, offset?: string | Date | number): Date;
	export = date;
}
