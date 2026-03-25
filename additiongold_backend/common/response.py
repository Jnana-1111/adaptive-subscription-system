def api_response(res, status, message, data=None):
    response = {
        "res": res,
        "res-status": status,
        "message": message
    }

    if data is not None:
        response["data"] = data

    return response, status