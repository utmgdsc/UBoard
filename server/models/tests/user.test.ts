import { makeUser, dbSync } from './testHelpers';
import db from '../index';

const User = db.User;


dbSync();


test("Attempt to create Users with invalid emails", async () => {

    await expect(makeUser("rejectedPerson1", "lol@gmail.com")).rejects.toThrowError("Validation error");
    await expect(makeUser("rejectedPerson2", "@utoronto.ca")).rejects.toThrowError("Validation error");
    await expect(makeUser("rejectedPerson3", "lol@gmailutoronto.ca")).rejects.toThrowError("Validation error");

});

test("Attempt to create two users with the same email", async () => {

    await expect(makeUser("acceptedPerson1", "lol@utoronto.ca")).resolves.toBeDefined();
    await expect(makeUser("rejectedPerson1", "lol@utoronto.ca")).rejects.toThrowError("Validation error");

});

test("Attempt to create two users with the same name", async () => {

    await expect(makeUser("personabc", "emails@utoronto.ca")).resolves.toBeDefined();
    await expect(makeUser("personabc", "lo22l@utoronto.ca")).rejects.toThrowError("Validation error");

});


test("Create basic users with valid name and email", async () => {

    await expect(makeUser("testPerson1", "testmail1@mail.utoronto.ca")).resolves.toBeDefined();
    await expect(makeUser("testPerson2", "testmail2@utoronto.ca")).resolves.toBeDefined();
    await expect(makeUser("testPerson3", "testmail3@alum.utoronto.ca")).resolves.toBeDefined();

    /* Query to see if anything was inserted */
    const testPers1 = await User.findOne({ 
        where: {
            userName: "testPerson1"
        }
    })
    expect(testPers1).toBeDefined();
    expect(testPers1.email).toContain("testmail1")
    expect(testPers1.userName).toEqual("testPerson1")
    

});


