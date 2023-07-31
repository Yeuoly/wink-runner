const go_template = `package main
import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
`
const python_template = `print("Hello, World!")`
const node_template = `console.log("Hello, World!")`

export const languages = [{
    'language': 'Go',
    'template': go_template,
    'extension': 'go',
    'new_dir_required': true,
    'command': 'go run ${file}',
}, {
    'language': 'Python',
    'template': python_template,
    'extension': 'py',
    'new_dir_required': false,
    'command': 'python ${file}',
}, {
    'language': 'Node',
    'template': node_template,
    'extension': 'js',
    'new_dir_required': false,
    'command': 'node ${file}',
}];