import { DataSource, DataSourceOptions } from 'typeorm'
import { baseTypeOrmConfig } from './typeorm.config'
import { SetConfigRoot } from './root.config'

SetConfigRoot()

const typeOrmConfig = baseTypeOrmConfig() as DataSourceOptions
const dataSource = new DataSource(typeOrmConfig)
dataSource.initialize()

export default dataSource
