from clients get sum(emails_submitted)

if(sum < 20) {
res.json({ message: 'holiday' })
update date in clients
return
}

from users get cas

for ca of cas {
logs = get clients where work_doneby = ca.id
isCompleted = true
incent = 0
if(!logs) {
update game_stats coins = min(0, coins - 50)
isCompleted = false
}

    for log of logs{
        if status != completed {
            if assigned_id == ca.id{
                isCompleted = false
            }
            if emails_required == 50 {
                if 45 < emails_submitted < 50{
                    incent += 1.8
                } else if 40 < emails_submitted < 45 {
                    incent += 1.7
                } else {
                    incent += 1.6
                }
            }
            else if emails_required == 40 {
                if 35 < emails_submitted < 40 {
                    incent += 1.3
                }
                else if 30 < emails_submitted < 35 {
                    incent += 1.2
                }
            }
            else {
                incent += 1
            }
        }
        // status completed
        else {
            if emails_required == 50 {
                incent += 2
            }
            else if emails_required == 40 {
                incent += 1.5
            }
            else {
                incent += 1
            }
        }
    }

    update in game_stats isCompleted ? {streak:+1, coins += 100} : {streak: 0}
    incents = from work_history get incentives column;
    incentive_factor = sum(incentives) + incent / incents.length
    //further logic later

}
