export class UpdateTodoDto {
  private constructor(
    public readonly id: number,
    public readonly title?: string,
    public readonly completed?: boolean,
    public readonly completedAt?: Date | null,
  ) {
  }

  get values() {
    const returnObj: { [key: string]: any } = {};
    if ( this.title ) returnObj.title = this.title;
    if ( this.completed !== undefined ) {
      returnObj.completed = this.completed;
      returnObj.completedAt = this.completedAt;
    }

    return returnObj;
  }

  static create( props: { [key: string]: any} ): [string?, UpdateTodoDto?] {
    const { id, title, completed, completedAt } = props;

    if ( !id  || isNaN(id) || id <= 0 ) {
      return [`ID argument is not valid`, undefined];
    }

    if ( completed !== undefined && typeof completed !== 'boolean' ) {
      return [`Completed argument is not valid`, undefined];
    }

    let newCompletedAt: Date | null = completedAt ? new Date(completedAt) : null;

    if ( completed && newCompletedAt === null ) {
      newCompletedAt = new Date();
    } else if (typeof completed === 'boolean' && completed === false) {
      newCompletedAt = null;
    }

    if ( newCompletedAt && isNaN(newCompletedAt.getTime()) ) {
      return [`CompletedAt argument is not valid`, undefined];
    }

    return [undefined, new UpdateTodoDto(id, title, completed, newCompletedAt)];
  }
}