export interface StyleShortcut {
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginHorizontal?: number;
    marginVertical?: number;

    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingBottom?:number;

    flex?: number;
}

interface Iany {
    [key:string]:any
}

export const extractShortcuts = ({
    margin,marginTop,marginBottom,marginLeft,marginRight,marginHorizontal,marginVertical,
    padding,paddingHorizontal,paddingVertical,paddingBottom,
    flex,
    ...others
}:StyleShortcut & Iany) => {
    const shortcut = {
        margin,marginTop,marginBottom,marginLeft,marginRight,marginHorizontal,marginVertical,
        padding,paddingHorizontal,paddingVertical,paddingBottom,
        flex,
    }
    Object.keys(shortcut)
        .forEach(key => {
            const k = key as keyof StyleShortcut
            shortcut[k] === undefined ? delete shortcut[k] : {}
        });
    return {
        shortcut,
        others
    }
}