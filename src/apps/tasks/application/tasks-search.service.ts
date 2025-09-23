import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TaskM } from '@tasks/domain/task';
import { TaskSearchBody } from '@tasks/infrastructure/persistence/types/task-search-body.interface';

@Injectable()
export class TasksSearchService {
  index = 'tasks';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexTask(task: TaskM) {
    return this.elasticsearchService.index<TaskSearchBody>({
      index: this.index,
      document: {
        id: task.id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
      },
    });
  }

  async search(text: string): Promise<TaskSearchBody[]> {
    const { hits } = await this.elasticsearchService.search<TaskSearchBody>({
      index: this.index,
      query: {
        bool: {
          should: [
            {
              wildcard: {
                title: {
                  value: `*${text.toLowerCase()}*`,
                },
              },
            },
            {
              wildcard: {
                description: {
                  value: `*${text.toLowerCase()}*`,
                },
              },
            },
          ],
        },
      },
    });

    return hits.hits.map((hit) => hit._source);
  }
}
