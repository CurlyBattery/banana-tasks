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

  async remove(taskId: number): Promise<void> {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: taskId,
        },
      },
    });
  }

  update(
    task: Omit<
      TaskM,
      'status' | 'deadline' | 'priority' | 'createdById' | 'assignedToId'
    >,
  ) {
    const newBody: TaskSearchBody = {
      id: task.id,
      title: task.title,
      description: task.description,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      if (typeof value === 'number') {
        return `${result} ctx._source.${key}=${value};`;
      }
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      query: {
        match: {
          id: task.id,
        },
      },
      script,
    });
  }
}
