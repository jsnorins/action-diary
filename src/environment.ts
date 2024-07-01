const env = (import.meta as any).env

export const getEnvironmentType = (): 'development' | 'staging' | 'production' => {
    return env.VITE_APP_ENV;
}