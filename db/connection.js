const {MongoClient} = require('mongodb');

async function main() {
        /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://jaredmorillo:jm123456@cluster0.lw9ifqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));

        /*await deleteListingByName(client, "Jared's Apartment");*/

        /*await uptdateAllListingsToHavePropertyType(client);*/

        /*await upsertListingByName(client, "Jared's House", {name: "Jared's Apartment", 
            bedrooms: 2, 
            bathrooms: 2});*/

        /*await updateListingByName(client, "Jared's House", {
            bedrooms: 6,
            beds: 8,
        })*/

        /* await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimunNumberOfBedrooms: 4,
            minimunNumberOfBathrooms: 2,
            maximumNumberOfResults: 5,
        });*/

        /*await findOneListingByName(client,"Jared's House");*/

        /*await createMultipleListings(client, [
            {
                name: "Jared's House",
                summary: "A cozy place to stay",
                bedrooms: 2,
                bathrooms: 1,
                beds: 2,
                price: 100,
                address: {
                    street: "123 Main St",
                    city: "Los Angeles",
                    state: "CA",
                    zip: "90001"
                },
                amenities: ["WiFi", "TV", "Kitchen"]
            },
            {
                name: "Jared's Apartment",
                summary: "A modern apartment in the city",
                bedrooms: 1,
                bathrooms: 1,
                beds: 1,
                price: 150,
                address: {
                    street: "456 Elm St",
                    city: "Los Angeles",
                    state: "CA",
                    zip: "90002"
                },
                amenities: ["WiFi", "TV", "Kitchen", "Gym"]
            }
        ]); */

    }   catch (e) {
        console.error(e);
    }   finally {
        await client.close();
    }

}

main().catch(console.error);

async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .deleteMany({"last_scraped": {$lt: date}});

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .deleteOne({name: nameOfListing});

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function uptdateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .updateMany({property_type: {$exists: false}}, 
        {$set: {property_type: "Unknown"}});

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .updateOne({name: nameOfListing}, {$set: updatedListing}, {upsert: true});

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .updateOne({name: nameOfListing}, {$set: updatedListing});

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
} 

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimunNumberOfBedrooms = 0,
    minimunNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER,

} = {}) {

    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: {$gt: minimunNumberOfBathrooms},
        bathrooms: {$gt: minimunNumberOfBedrooms},
    }).sort({last_review: -1}).limit(maximumNumberOfResults);
    
    const result = await cursor.toArray();
    if (result.length > 0) {
        console.log(`Found listings with at least ${minimunNumberOfBedrooms} bedrooms and ${minimunNumberOfBathrooms} bathrooms:`);
        result.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`  bedrooms: ${result.bedrooms}`);
            console.log(`  bathrooms: ${result.bathrooms}`);
            console.log(`  most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        console.log(`No listings found with at least ${minimunNumberOfBedrooms} bedrooms and ${minimunNumberOfBathrooms} bathrooms`);
    }

}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }

}

async function createMultipleListings(client, newListings) {
    const results = await client.db("sample_airbnb").collection("listingsAndReviews")
    .insertMany(newListings);

    console.log(`${results.insertedCount} new listings created with the following id
        (s):`);
        console.log(results.insertedIds);
}

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .insertOne(newListing); 

    console.log(`New listing created with the following id: ${result.insertedId}`);

}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};