import db from '../index';



/* 
Create a User entry in our database with the given user and email string. Returns
the entry that was created on success, or throws an error on failure.
*/
export async function makeUser(user: string, email: string) {
        const testUser = await db.User.create({
        userName: user,
        password: "pass",
        email: email,

        }).catch( (err: Error) => { throw err });

        return testUser;
 
}

/* Create a (basic) Post entry in our database with the provided userid of the author, 
title, and body. Return the post on success, or throw an error on failure. 
*/
export async function makePost(authorid: string | null, title: string, body: string) {
        const testUser = await db.Post.create({
        title: title,
        body: body,
        UserId: authorid

        }).catch( (err: Error) => { throw err });

        return testUser;

}

/* Ensure that the database is synchronized properly */
export function dbSync(){ 
        test("Test model sync", async () => {
                await db.sequelize.sync().then(() => {
                expect(db).toBeDefined();
                expect(db.User).toBeDefined();
                }
                );
        });
}