import { CodeClassDef, ICodeClassDef } from '../../models/code/codeclass';
import { MediaDef, IMediaDef } from '../../models/code/media';
import { LocalDef, ILocalDef } from '../../models/code/local';
import { EditionDef, IEditionDef } from '../../models/code/edition';
import { SectionDef, ISectionDef } from '../../models/code/section';
import { AdverSizeDef, IAdverSizeDef } from '../../models/code/adversize';
import { AdverLocalDef, IAdverLocalDef } from '../../models/code/adverlocal';
import { ColorDef, IColorDef } from '../../models/code/color';
import { PrintTypeDef, IPrintTypeDef } from '../../models/code/printtype';
import { ClosingTimeDef, IClosingTimeDef } from '../../models/code/closingtime';
import { PageSizeDef, IPageSizeDef } from '../../models/code/pagesize';
import { FontDef, IFontDef } from '../../models/code/font';
import { TextStyleDef, ITextStyleDef } from '../../models/code/textstyle';

export default {
    codeclass: async (mediaId: number) => {
        const resultModels = await CodeClassDef.selectByMediaId(mediaId);
        const ret: ICodeClassDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    media: async () => {
        const resultModels = await MediaDef.select();
        const ret: IMediaDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    local: async (mediaId: number) => {
        const resultModels = await LocalDef.selectByMediaId(mediaId);
        const ret: ILocalDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    edition: async (mediaId: number) => {
        const resultModels = await EditionDef.selectByMediaId(mediaId);
        const ret: IEditionDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    section: async (mediaId: number) => {
        const resultModels = await SectionDef.selectByMediaId(mediaId);
        const ret: ISectionDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    adversize: async (mediaId: number) => {
        const resultModels = await AdverSizeDef.selectByMediaId(mediaId);
        const ret: IAdverSizeDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    adverlocal: async (mediaId: number) => {
        const resultModels = await AdverLocalDef.selectByMediaId(mediaId);
        const ret: IAdverLocalDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    color: async () => {
        const resultModels = await ColorDef.select();
        const ret: IColorDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    printtype: async () => {
        const resultModels = await PrintTypeDef.select();
        const ret: IPrintTypeDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    closingtime: async (mediaId: number) => {
        const resultModels = await ClosingTimeDef.selectByMediaId(mediaId);
        const ret: IClosingTimeDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    pagesize: async () => {
        const resultModels = await PageSizeDef.select();
        const ret: IPageSizeDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    font: async (mediaId: number) => {
        const resultModels = await FontDef.selectByMediaId(mediaId);
        const ret: IFontDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    },
    textstyle: async (mediaId: number) => {
        const resultModels = await TextStyleDef.selectByMediaId(mediaId);
        const ret: ITextStyleDef[] = [];
        if (resultModels === null) return null;
        for (const model of resultModels) ret.push(model.data);
        return ret;
    }
};