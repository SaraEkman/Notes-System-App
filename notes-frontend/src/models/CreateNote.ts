export class CreateNote {
  deleted: number
  constructor(
    public content: string,
    public created_at: string,
    public created_by: number,
    public updated_by: number,
    deleted: boolean,
  ) {
    this.deleted = deleted ? 1 : 0
  }
}
