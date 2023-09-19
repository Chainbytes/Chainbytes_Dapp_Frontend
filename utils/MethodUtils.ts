export const signMessage = async (provider: any, address: string) => {
    if (!provider) {
        throw new Error('Not Connected.\n');
    }

    //Draft Message Parameters
    const message = 'Please sign this message to prove ownership of your address.';
    const msgParams = [message, address];
    const result = await provider.request({
        method: 'personal_sign',
        params: msgParams,
    });
    return JSON.stringify(result);
}