import { IsEnum } from 'class-validator'
import { FileUploadTypes, defaultAssetsFolders } from 'types'

// export class File {
//   filePath: string;
//   fileName: string;
// }

export class DefaultTypeParam {
	@IsEnum(FileUploadTypes)
	type: defaultAssetsFolders
}
