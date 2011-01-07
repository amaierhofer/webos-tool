if [ $# == 2 ]; then
    rsync -ravz --exclude .git* $1 $2
else
    echo '----'
    echo '$> run_rsync source target'
fi

