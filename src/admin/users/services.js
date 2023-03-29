const user = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        let serchobj={};
        let searchobj={};
        if(req.query.name)
     {
        searchobj.name=req.query.name;   
        serchobj.name={$regex:req.query.name,$options:"i"};

    }
        if(req.query.email)
        {searchobj.email=req.query.email;
            serchobj.email={$regex:req.query.email,$options:"i"};
            
}
        if(req.query.mobile)
        {searchobj.phone=req.query.mobile
            serchobj.phone={$regex:req.query.mobile,$options:"i"};
            
        }
        if(req.query.gender)
        {
            searchobj.gender=req.query.gender
            serchobj.gender={$regex:req.query.gender,$options:"i"};
            
        }
        





        const Finddata = await user.aggregate([
            {'$match':serchobj},{
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'result'
                }
            }, {
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'password': 1,
                    'otp': 1,
                    '__v': 1,
                    'updatedAt': 1,
                    'auth': 1,
                    'image': 1,
                    'dateOfBirth': 1,
                    'gender': 1,
                    'type':1,
                    'numberOfOrder': {
                        '$cond': {
                            'if': {
                                '$isArray': '$result'
                            },
                            'then': {
                                '$size': '$result'
                            },
                            'else': 'NA'
                        }
                    }
                }
            }
        ]);

        // console.log("Finddata", Finddata)
        return {
            statusCode: 200,
            status: true,
            message: "address-is already in database !",
            data: Finddata,
            searchobj:searchobj
        };
    } catch (error) {
        console.log(error);
    };
};


