export interface SignatureResponse {
	signature: string;
	tries: number;
	cadence: {
		received_at: string;
		created_at: string;
		expires_at: string;
	};
}
