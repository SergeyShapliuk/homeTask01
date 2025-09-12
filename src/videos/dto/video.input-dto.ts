export type VideoInputDto = {
    title: string,
    author: string,

    canBeDownloaded?: boolean,
    minAgeRestriction?: null,
    createdAt?: string,
    publicationDate?: string,

    availableResolutions: string[];
}
